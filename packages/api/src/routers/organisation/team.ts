import { removeUserPrivateMetadata } from "@api/handlers/metadata/user-private-meta";
import {
  acceptInvite,
  getInviteDetails,
  getOrgnanisationTeams,
  inviteUserToOrganisation,
  organisationMembershipAdded,
  rejectInvite,
  removeUserFromOrganisation,
} from "@api/handlers/organisation/teams";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { UserDetails } from "@aperturs/validators/user";
import { eq, schema } from "@aperturs/db";
import {
  changeUserRoleSchema,
  inviteUserToOrganisationSchema,
  organisationRoleSchema,
} from "@aperturs/validators/organisation";

export const OrganizationTeam = createTRPCRouter({
  getOrganisationTeams: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const res = await getOrgnanisationTeams(input.orgId);
      const final = res.map((team) => {
        return {
          name:
            (team.user.userDetails as UserDetails).firstName +
            " " +
            (team.user.userDetails as UserDetails).lastName,
          role: team.role,
          email: (team.user.userDetails as UserDetails).primaryEmail,
          avatarUrl: (team.user.userDetails as UserDetails).profileImageUrl,
          id: team.id,
          userId: team.clerkUserId,
        };
      });

      return final;
    }),

  changeUserRole: protectedProcedure
    .input(changeUserRoleSchema)
    .mutation(async ({ input, ctx }) => {
      // const res = await ctx.prisma.organizationUser.update({
      //   where: {
      //     id: input.orgUserId,
      //   },
      //   data: {
      //     role: input.newRole,
      //   },
      // });
      const [res] = await ctx.db
        .update(schema.organizationUser)
        .set({
          role: input.newRole,
          updatedAt: new Date(),
        })
        .where(eq(schema.organizationUser.id, input.orgUserId))
        .returning()
        .catch((err) => {
          console.log(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err as string,
          });
        });
      if (!res) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error changing role",
        });
      }
      // await changeUserRoleMetaData({
      //   orgId: res.organizationId,
      //   newRole: input.newRole,
      // });
      return res;
    }),

  removeUserFromOrganisation: protectedProcedure
    .input(z.object({ orgUserId: z.string() }))
    .mutation(async ({ input }) => {
      const res = await removeUserFromOrganisation(input.orgUserId);
      await removeUserPrivateMetadata({
        orgId: res.organizationId,
        role: res.role,
      });
    }),

  inviteUserToOrganisation: protectedProcedure
    .input(
      inviteUserToOrganisationSchema.omit({
        inviterId: true,
        inviterName: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const details = await ctx.db.query.organization.findFirst({
        where: eq(schema.organization.id, input.orgId),
        with: {
          owner: true,
        },
      });

      const userDetails = details?.owner?.userDetails as UserDetails;
      const userName = userDetails.firstName + " " + userDetails.lastName;
      const userImage = userDetails.profileImageUrl;
      const teamImage = details?.logo;
      const teamName = details?.name;
      // console.log(user,'user')
      console.log(userName, userImage, teamImage, teamName);
      const res = await inviteUserToOrganisation({
        ...input,
        inviterId: ctx.currentUser,
        inviterName: userName,
      });
      // const inviteId = res.id;
      // const sendEmail = await sendInvitationViaEmail({
      //   invitationId: inviteId,
      //   teamName: teamName ?? "team",
      //   teamImage: teamImage ?? "https://app.aperturs.com/profile.jpeg",
      //   userImage: userImage ?? "https://app.aperturs.com/user.png",
      //   userName: input.name,
      //   toEmail: input.email,
      //   inviteFromIp: "",
      //   inviteFromLocation: "São Paulo, Brazil",
      //   invitedByName: userName,
      // });
      const final = Promise.all([res]);
      return final;
    }),

  getInviteDetails: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .query(async ({ input }) => {
      const res = getInviteDetails(input);
      return res;
    }),

  acceptInvite: publicProcedure
    .input(
      z.object({
        inviteId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const inviteDetails = await ctx.db.query.organizationInvites.findFirst({
        where: eq(schema.organizationInvites.id, input.inviteId),
      });
      if (
        inviteDetails?.status === "ACCEPTED" ||
        inviteDetails?.status === "REJECTED" ||
        inviteDetails?.status === "CANCELLED"
      ) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message:
            "This invitation has already been accepted or rejected or cancelled",
        });
      }
      const final = await acceptInvite({
        inviteId: input.inviteId,
      });
      return final;
    }),

  organisationMembershipCreated: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        orgId: z.string(),
        role: organisationRoleSchema,
      }),
    )
    .mutation(async ({ input }) => {
      await organisationMembershipAdded({
        orgId: input.orgId,
        userId: input.userId,
        role: input.role,
      });
    }),

  rejectInvite: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // const inviteDetails = await ctx.prisma.organizationInvites.findUnique({
      //   where: {
      //     id: input.inviteId,
      //   },
      // });
      const inviteDetails = await ctx.db.query.organizationInvites.findFirst({
        where: eq(schema.organizationInvites.id, input.inviteId),
      });
      if (
        inviteDetails?.status === "ACCEPTED" ||
        inviteDetails?.status === "REJECTED" ||
        inviteDetails?.status === "CANCELLED"
      ) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message:
            "This invitation has already been accepted or rejected or cancelled",
        });
      }
      const user = await clerkClient.users.getUser(ctx.currentUser);
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      )?.emailAddress;
      if (primaryEmail !== inviteDetails?.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "This invitation is not for you",
        });
      }
      const final = rejectInvite({ inviteId: input.inviteId });
      return final;
    }),

  cancelInvite: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // const inviteDetails = await ctx.prisma.organizationInvites.findUnique({
      //   where: {
      //     id: input.inviteId,
      //   },
      // });
      const inviteDetails = await ctx.db.query.organizationInvites.findFirst({
        where: eq(schema.organizationInvites.id, input.inviteId),
      });
      if (
        inviteDetails?.status === "ACCEPTED" ||
        inviteDetails?.status === "REJECTED" ||
        inviteDetails?.status === "CANCELLED"
      ) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message:
            "This invitation has already been accepted or rejected or cancelled",
        });
      }
    }),
});
