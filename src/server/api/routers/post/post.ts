import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const posting = createTRPCRouter({
  savePost: protectedProcedure
    .input(
      z.object({
        selectedSocials: z.array(
          z.object({
            id: z.number(),
            type: z.string(),
            platformId: z.number(),
          })
        ),
        postContent: z.array(
          z.object({
            id: z.number(),  
            socialType: z.string(),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      try {
        // await ctx.prisma.post.create({
        //     data: {
        //         userId: ctx.currentUser,
        //         selectedSocials: input.selectedSocials,
        //     }

        return {
          success: true,
          message: "Saved to draft successfully",
          state: 200,
        };
      } catch (error) {
        return { success: false, message: "Error saving to draft" };
      }
    }),
});
