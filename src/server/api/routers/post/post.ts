import { TRPCError } from "@trpc/server";
import axios from "axios";
import https from "https";
import { z } from "zod";
import { env } from "~/env.mjs";
import { SocialType } from "~/types/post-enums";
import { type PostContentType } from "~/types/post-types";
import { postToLinkedin } from "../../helpers/linkedln";
import { postToTwitter } from "../../helpers/twitter";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";

export const post = createTRPCRouter({
  postByPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.findUnique({
          where: {
            id: input.postId,
          },
        });
        if (post) {
          const content = post.content as unknown as PostContentType[];
          content.forEach(async (item) => {
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
          });
        }
        await ctx.prisma.post.update({
          where: { id: input.postId },
          data: {
            status: "PUBLISHED",
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching post",
        });
      }
    }),

  schedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const inputDate = new Date(input.date.toUTCString());
      const currentDate = new Date(new Date().toUTCString());
      console.log(inputDate, currentDate);
      try {
        const delay = Math.round(
          (inputDate.getTime() - currentDate.getTime()) / 1000
        );
        // console.log(de)
        const headers = {
          Accept: "/",
          url: `${env.CRONJOB_SCHEDULE_URL}?id=${input.id}&userId=${ctx.currentUser}`,
          delay: `${input.date.toDateString()}`,
          Authorization: env.CRONJOB_AUTH,
        };
        const url = "https://52.66.162.116/v1/publish";
        await axios
          .post(
            url,
            {},
            {
              headers,
              httpsAgent: new https.Agent({
                rejectUnauthorized: false,
              }),
            }
          )
          .catch((error) => {
            console.error("Error:", error);
          });
        return {
          success: true,
          message: "Post scheduled successfully",
          state: 200,
        };
      } catch (err) {
        return {
          success: false,
          message: "Error scheduling post",
          state: 500,
        };
      }
    }),
});
