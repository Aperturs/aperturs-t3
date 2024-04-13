import {
  GetPresignedUrl,
  scheduleLambdaEvent,
} from "@api/handlers/posts/uploads";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PostContentType } from "@aperturs/validators/post";
import { eq, schema } from "@aperturs/db";
import { SocialType } from "@aperturs/validators/post";

import { env } from "../../../env";
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
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
        }

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

  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        filekey: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await GetPresignedUrl({
        fileKey: input.filekey,
        fileType: input.fileType,
      });
    }),

  schedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await scheduleLambdaEvent({
          time: input.date,
          url: `${env.DOMAIN}api/post/scheduled?postid=${input.id}`,
          postid: input.id,
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
