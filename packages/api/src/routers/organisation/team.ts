import {
  changeUserRoleMetaData,
  removeUserPrivateMetadata,
} from "@api/handlers/metadata/user-private-meta";
import {
  acceptInvite,
  getInviteDetails,
  getOrgnanisationTeams,
  inviteUserToOrganisation,
  rejectInvite,
  removeUserFromOrganisation,
  sendInvitationViaEmail,
} from "@api/handlers/organisation/teams";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { auth, clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { UserDetails } from "@aperturs/validators/user";
import { eq, schema } from "@aperturs/db";
import {
  changeUserRoleSchema,
  inviteUserToOrganisationSchema,
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
        .returning();
      if (!res) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error changing role",
        });
      }
      await changeUserRoleMetaData({
        orgId: res.organizationId,
        newRole: input.newRole,
      });
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
      // const orgDetails = await ctx.prisma.organization.findUnique({
      //   where: {
      //     id: input.orgId,
      //   },
      // });
      const orgDetails = await ctx.db.query.organization.findFirst({
        where: eq(schema.organization.id, input.orgId),
      });
      const { user } = auth();
      const userName = user?.firstName + " " + user?.lastName;
      const userImage = user?.imageUrl;
      const teamImage = orgDetails?.logo;
      const teamName = orgDetails?.name;
      const res = await inviteUserToOrganisation({
        ...input,
        inviterId: ctx.currentUser,
        inviterName: userName,
      });
      const inviteId = res.id;
      const sendEmail = await sendInvitationViaEmail({
        invitationId: inviteId,
        teamName: teamName ?? "team",
        teamImage: teamImage ?? "https://app.aperturs.com/profile.jpeg",
        userImage: userImage ?? "https://app.aperturs.com/user.png",
        userName: input.name,
        toEmail: input.email,
        inviteFromIp: "",
        inviteFromLocation: "São Paulo, Brazil",
        invitedByName: userName,
      });
      const final = Promise.all([res, sendEmail]);
      return final;
    }),

  getInviteDetails: protectedProcedure
    .input(z.object({ inviteId: z.string() }))
    .query(async ({ input }) => {
      const res = getInviteDetails(input);
      return res;
    }),

  acceptInvite: protectedProcedure
    .input(
      z.object({
        inviteId: z.string(),
      }),
    )
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
      const final = await acceptInvite({
        inviteId: input.inviteId,
        userId: ctx.currentUser,
      });
      return final;
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
