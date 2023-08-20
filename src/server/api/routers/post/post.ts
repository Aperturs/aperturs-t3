import { type Platform } from "@prisma/client";
import { z } from "zod";
import { SocialType } from "~/types/post-enums";
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // type contentIDS = {
        //   id: string;
        // }
        const unmatchedSocials = [];
        const ContentIDS: string[] = [];

        try{

        for (const social of input.selectedSocials) {
          const content = input.postContent.find(
            (content) => content.id === social.id
          );
          console.log(content?.content);

          if (content && content.content && social.type) {
            await ctx.prisma.content
              .create({
                data: {
                  content: content.content,
                  socialSelected: {
                    create: {
                      platform: social.type as Platform,
                      platformId: social.id,
                    },
                  },
                },
              })
              .then((res) => {
                ContentIDS.push(res.id);
              });
          } else {
            unmatchedSocials.push(social);
          }
        }

        const DefaultContent = input.postContent.find(
          (content) => content.id === SocialType.Default
        )?.content;

        if (unmatchedSocials.length > 0 && DefaultContent) {
          await ctx.prisma.content
            .create({
              data: {
                id: "DEFAULT",
                content: DefaultContent,
                socialSelected: {
                  create: unmatchedSocials.map((social) => ({
                    platform: social.type as Platform,
                    platformId: social.id,
                  })),
                },
              },
            })
            .then((res) => {
              ContentIDS.push(res.id);
            });
        }

        await ctx.prisma.post.create({
          data: {
            clerkUserId: ctx.currentUser,
            status: "SAVED",
            content: {
              connect: ContentIDS.map((id) => ({ id: id })),
            },
          },
        });
      }catch(error){
        console.log(error);
      }

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
