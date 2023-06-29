import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.upsert({
        where: { clerkUserId: input.clerkId},
        create: {
          clerkUserId:  input.clerkId
          // Set other fields from evt.data if needed
        },
        update: {
          // Update other fields from evt.data if needed
        },
      });
      return user;
    }),
  addLinkedln: privateProcedure
    .input(
      z.object({
        profileImage: z.string(),
        vanityName: z.string(),
        profileId: z.string(),
        access_token: z.string(),
        refresh_token: z.string().optional(),
        expires_in: z.date(),
        refresh_token_expires_in: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {}),
});
