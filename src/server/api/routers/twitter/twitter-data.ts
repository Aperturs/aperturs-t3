import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const twitterOrgAuth = createTRPCRouter({
  createUser: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        clientSecret:z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.twitterToken.create({
        data: {
            client_id: input.clientId,
            client_secret:input.clientSecret,
            clerkUserId: ctx.currentUser
        },
      });
      return user;
    }),
});
