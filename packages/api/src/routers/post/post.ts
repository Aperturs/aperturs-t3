/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  GetPresignedUrl,
  scheduleLambdaEvent,
} from "@api/handlers/posts/uploads";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type {
  BasePostContentType,
  PostContentType,
  SocialType,
} from "@aperturs/validators/post";
import { eq, schema } from "@aperturs/db";

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
      console.log(input, "postby post id");
      try {
        const post = await ctx.db.query.post.findFirst({
          where: eq(schema.post.id, input.postId),
        });
        if (post) {
          const content = post.content as PostContentType[];
          const promises = content.map(async (item) => {
            switch (item.socialType) {
              case `${"DEFAULT" as SocialType}`:
                return;
              case `${"TWITTER" as SocialType}`:
                return await postToTwitter({
                  tokenId: item.id,
                  tweets: item.content as BasePostContentType[],
                })
                  .then(() => {
                    console.log("Posted to Twitter");
                  })
                  .catch((error) => {
                    console.error("Failed to post to Twitter", error);
                    throw Error("Failed to post to Twitter");
                  });

              case `${"LINKEDIN" as SocialType}`:
                console.log(item, "linkedin item");
                return await postToLinkedin({
                  ...item,
                  content: item.content as string,
                }).catch((error) => {
                  console.error("Failed to post to LinkedIn", error);
                  throw Error("Failed to post to linkedin");
                });

              default:
                return Promise.resolve(); // resolves immediately for unsupported types
            }
          });
          // Wait for all promises to resolve
          await Promise.all(promises).catch((e) => {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `something went wrong ${e.message}`,
            });
          });
        }
        // await ctx.db
        //   .update(schema.post)
        //   .set({
        //     status: "PUBLISHED",
        //     updatedAt: new Date(),
        //   })
        //   .where(eq(schema.post.id, input.postId));

        return {
          success: true,
          message: "succesully published",
          state: 200,
        };
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
    .mutation(async ({ input }) => {
      try {
        console.log("Scheduling post", input);
        await scheduleLambdaEvent({
          time: input.date,
          url: `${env.DOMAIN}/api/post/scheduled?postid=${input.id}`,
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
