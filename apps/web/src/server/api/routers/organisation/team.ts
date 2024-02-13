import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getOrgnanisationTeams } from "~/server/functions/organisation/teams";
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
});
