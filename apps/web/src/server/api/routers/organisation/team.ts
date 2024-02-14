import { auth } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { inviteUserToOrganisationSchema } from "~/server/functions/organisation/organisation-types";
import {
  getOrgnanisationTeams,
  inviteUserToOrganisation,
  sendInvitationViaEmail,
} from "~/server/functions/organisation/teams";
import { type UserDetails } from "~/types/user-type";

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
    .input(
      z.object({
        orgUserId: z.string(),
        newRole: z.enum(["ADMIN", "MEMBER", "EDITOR"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.prisma.organizationUser.update({
        where: {
          id: input.orgUserId,
        },
        data: {
          role: input.newRole,
        },
      });
      return res;
    }),

  inviteUserToOrganisation: protectedProcedure
    .input(inviteUserToOrganisationSchema)
    .mutation(async ({ input, ctx }) => {
      const orgDetails = await ctx.prisma.organization.findUnique({
        where: {
          id: input.orgId,
        },
      });
      const { user } = auth();
      const userName = user?.firstName + " " + user?.lastName;
      const userImage = user?.imageUrl;
      const teamImage = orgDetails?.logo;
      const teamName = orgDetails?.name;
      const res = await inviteUserToOrganisation(input);
      const inviteId = res.id;
      const sendEmail = await sendInvitationViaEmail({
        invitationId: inviteId,
        teamName: teamName || "team",
        teamImage: teamImage || "/profile.jpeg",
        userImage: userImage || "/user.png",
        userName: input.name,
        toEmail: input.email,
        inviteFromIp: "",
        inviteFromLocation: "São Paulo, Brazil",
        invitedByName: userName,
      });
      const final = Promise.all([res, sendEmail]);
      return final;
    }),
});
