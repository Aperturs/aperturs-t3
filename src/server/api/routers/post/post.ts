import { type Platform } from "@prisma/client";
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // type contentIDS = {
        //   id: string;
        // }
        const unmatchedSocials = [];
        const ContentIDS: string[] = [];
        let postId = "";

        try {
          await ctx.prisma.post
            .create({
              data: {
                clerkUserId: ctx.currentUser,
                status: "SAVED",
                content: {
                  connect: ContentIDS.map((id) => ({ id: id })),
                },
              },
            })
            .then((res) => {
              postId = res.id;
            });
          for (const social of input.selectedSocials) {
            const content = input.postContent.find(
              (content) => content.id === social.id
            );
            console.log(content?.content);

            if (content && content.content && social.type) {
              await ctx.prisma.content.create({
                data: {
                  content: content.content,
                  postId: postId,
                  socialSelected: {
                    create: {
                      platform: social.type as Platform,
                      platformId: social.id,
                    },
                  },
                },
              });
            } else {
              unmatchedSocials.push(social);
            }
          }

          if (unmatchedSocials.length > 0) {
            await ctx.prisma.content.create({
              data: {
                content: input.defaultContent,
                postId: postId,
                socialSelected: {
                  create: unmatchedSocials.map((social) => ({
                    platform: social.type as Platform,
                    platformId: social.id,
                  })),
                },
              },
            });
          }

          return {
            success: true,
            message: "Saved to draft successfully",
            state: 200,
          };
        } catch (error) {
          return { success: false, message: "Error saving to draft try again" };
        }
      } catch (error) {
        return { success: false, message: "Error saving to draft" };
      }
    }),
});
