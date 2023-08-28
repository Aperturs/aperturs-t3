import { TRPCError } from "@trpc/server";
import axios from "axios";
import https from "https";
import { z } from "zod";
import { env } from "~/env.mjs";
import { SocialType } from "~/types/post-enums";
import { postToLinkedin } from "../../helpers/linkedln";
import { postToTwitter } from "../../helpers/twitter";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";

export const post = createTRPCRouter({
  postbyid: publicProcedure
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
          const content = post.content as unknown as PostContent[];
          const selectedSocials =
            post.socialSelected as unknown as SelectedSocial[];
          const defaultContent = post.defaultContent;
          for (const item of selectedSocials) {
            const PostContent =
              content.find((post) => post.id === item.id)?.content ||
              defaultContent;
            if (!item.id) continue;
            switch (item.type) {
              case `${SocialType.Twitter}`:
                await postToTwitter({
                  tokenId: item.id,
                  tweets: [
                    {
                      id: 0,
                      text: PostContent,
                    },
                  ],
                });
                break;
              case `${SocialType.Linkedin}`:
                await postToLinkedin({
                  tokenId: item.id,
                  content: PostContent,
                });
                //post to linkedin
                break;
              default:
                break;
            }
          }
          // if (!twitterError || !linkedinError) {
          //   reset();
          // }
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
      console.log(`${input.date.getTime() - Date.now()}`, "delay ms");

      try{
      const delay = input.date.getTime() - Date.now();
      const headers = {
        Accept: "/",
        url: `${env.CRONJOB_SCHEDULE_URL}?id=${input.id}&userId=${ctx.currentUser}`,
        delay: `${delay} milliseconds`,
        Authorization: env.CRONJOB_AUTH,
      };
      console.log(headers)
      const url = "https://52.66.162.116/v1/publish";
      const res = await axios
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
      console.log("Response", res?.data);
      return {
        success: true,
        message: "Post scheduled successfully",
        state: 200,
      };
      }catch(err){
        return {
          success: false,
          message: "Error scheduling post",
          state: 500,
        };
      }
    }),
});
