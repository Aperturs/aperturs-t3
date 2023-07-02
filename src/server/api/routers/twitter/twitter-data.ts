import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { getAccessToken } from "../../helpers";



export const twitterOrgAuth = createTRPCRouter({
  fetchConnectedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.prisma.twitterToken.findMany({
      where: {
        clerkUserId: ctx.currentUser,
      },
      select: {
        id: true,
        access_token: true,
        profileId: true,
        profileImage: true,
        userName: true,
      },
    });
    return { accounts };
  }),
  getAccessToken: protectedProcedure.input(z.object({
        tokenId: z.number(),})).query(async ({ ctx, input }) => {
     const token = await getAccessToken(input.tokenId, ctx.prisma);
     return { token };
    }),
});
