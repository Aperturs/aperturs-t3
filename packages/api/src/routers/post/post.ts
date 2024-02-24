import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PostContentType } from "@aperturs/validators/post";
import { eq, schema } from "@aperturs/db";
import { SocialType } from "@aperturs/validators/post";

import { postToLinkedin } from "../../helpers/linkedln";
import { postToTwitter } from "../../helpers/twitter";
import { createTRPCRouter, publicProcedure } from "../../trpc";

export const post = createTRPCRouter({
  postByPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const post = await ctx.prisma.post.findUnique({
        //   where: {
        //     id: input.postId,
        //   },
        // });
        const post = await ctx.db.query.post.findFirst({
          where: eq(schema.post.id, input.postId),
        });
        if (post) {
          const content = post.content as PostContentType[];
          for (const item of content) {
            switch (item.socialType) {
              case `${SocialType.Twitter}`:
                await postToTwitter({
                  tokenId: item.id,
                  tweets: [
                    {
                      id: 0,
                      text: item.content,
                    },
                  ],
                });
                break;
              case `${SocialType.Linkedin}`:
                await postToLinkedin({
                  tokenId: item.id,
                  content: item.content,
                });
                //post to linkedin
                break;
              default:
                break;
            }
          }
          // content.forEach(async (item) => {
          //   switch (item.socialType) {
          //     case `${SocialType.Twitter}`:
          //       await postToTwitter({
          //         tokenId: item.id,
          //         tweets: [
          //           {
          //             id: 0,
          //             text: item.content,
          //           },
          //         ],
          //       });
          //       break;
          //     case `${SocialType.Linkedin}`:
          //       await postToLinkedin({
          //         tokenId: item.id,
          //         content: item.content,
          //       });
          //       //post to linkedin
          //       break;
          //     default:
          //       break;
          //   }
          // });
        }
        // await ctx.prisma.post.update({
        //   where: { id: input.postId },
        //   data: {
        //     status: "PUBLISHED",
        //   },
        // });
        await ctx.db
          .update(schema.post)
          .set({
            status: "PUBLISHED",
            updatedAt: new Date(),
          })
          .where(eq(schema.post.id, input.postId));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching post",
        });
      }
    }),

  // schedule: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       date: z.date(),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const inputDate = new Date(input.date.toUTCString());
  //     const currentDate = new Date(new Date().toUTCString());
  //     console.log(inputDate, currentDate);
  //     try {
  //       const delay = Math.round(
  //         (inputDate.getTime() - currentDate.getTime()) / 1000,
  //       );
  //       // console.log(de)
  //       const headers = {
  //         Accept: "/",
  //         url: `${env.CRONJOB_SCHEDULE_URL}?id=${input.id}&userId=${ctx.currentUser}`,
  //         delay: `${input.date.toDateString()}`,
  //         Authorization: env.CRONJOB_AUTH,
  //       };
  //       const url = "https://52.66.162.116/v1/publish";
  //       await axios
  //         .post(
  //           url,
  //           {},
  //           {
  //             headers,
  //             httpsAgent: new https.Agent({
  //               rejectUnauthorized: false,
  //             }),
  //           },
  //         )
  //         .catch((error) => {
  //           console.error("Error:", error);
  //         });
  //       return {
  //         success: true,
  //         message: "Post scheduled successfully",
  //         state: 200,
  //       };
  //     } catch (err) {
  //       return {
  //         success: false,
  //         message: "Error scheduling post",
  //         state: 500,
  //       };
  //     }
  //   }),
});
