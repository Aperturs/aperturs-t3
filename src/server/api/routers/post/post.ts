import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

// const socialSelectedSchema = z.array(
//   z.object({
//     id: z.string(),
//     type: z.nativeEnum(SocialType),
//   })
// );

export const posting = createTRPCRouter({
  savePost: protectedProcedure
    .input(
      z.object({
        selectedSocials: z.array(
          z.object({
            id: z.string(),
            type: z.string(),
            name: z.string(),
          })
        ),
        postContent: z.array(
          z.object({
            id: z.string(),
            socialType: z.string(),
            content: z.string(),
          })
        ),
        defaultContent: z.string(),
        scheduledTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const unmatchedSocials = [];
      // let postId = "";

      try {
        await ctx.prisma.post
          .create({
            data: {
              clerkUserId: ctx.currentUser,
              status: input.scheduledTime ? "SCHEDULED" : "SAVED",
              scheduledAt: input.scheduledTime
                ? new Date(input.scheduledTime)
                : null,
              defaultContent: input.defaultContent,
              content: input.postContent,
              socialSelected: input.selectedSocials
            },
          })

        // try {
        //   for (const social of input.selectedSocials) {
        //     const content = input.postContent.find(
        //       (content) => content.id === social.id
        //     );
        //     console.log(content?.content);
        //     if (content && content.content && social.type) {
        //       await ctx.prisma.content.create({
        //         data: {
        //           content: content.content,
        //           postId: postId,
        //           socialSelected: [
        //             {
        //               id: social.id,
        //               type: social.type,
        //               name: social.name,
        //             },
        //           ],
        //         },
        //       });
        //     } else {
        //       unmatchedSocials.push(social);
        //     }
        //   }

        //   if (unmatchedSocials.length > 0) {
        //     await ctx.prisma.content.create({
        //       data: {
        //         content: input.defaultContent,
        //         postId: postId,
        //         socialSelected: unmatchedSocials,
        //       },
        //     });
        //   } else {
        //     await ctx.prisma.content.create({
        //       data: {
        //         content: input.defaultContent,
        //         postId: postId,
        //       },
        //     });
        //   }
        // } catch (error) {
        //   await ctx.prisma.post.delete({
        //     where: { id: postId },
        //   });
        // }

        return {
          success: true,
          message: "Saved to draft successfully",
          state: 200,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error saving to draft",
        });
      }
    }),

  getSavedPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: { clerkUserId: ctx.currentUser, status: "SAVED" },
    });
    return posts;
  }),

  getSavedPostById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input },
      });
      return post;
    }),
});
