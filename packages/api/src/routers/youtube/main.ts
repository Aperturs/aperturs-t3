import {
  postToYoutube,
  refreshYoutubeDataInDatabase,
  saveYoutubeContent,
  updateYoutubeContent,
  youtubeAuthUrl,
} from "@api/handlers/youtube/main";
import { limitWrapper, verifyLimitAndRun } from "@api/helpers/limitWrapper";
import { redis } from "@api/index";
import { z } from "zod";

import { db, schema, tokens } from "@aperturs/db";
import { updateYoutubePostSchema } from "@aperturs/validators/post";
import { SocialRedisKeySchema } from "@aperturs/validators/socials";

import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const youtubeRouter = createTRPCRouter({
  addYoutubeToDatabase: protectedProcedure
    .input(tokens.youtubeTokenInsertSchema)
    .mutation(async ({ ctx, input }) => {
      await limitWrapper(
        async () => await db.insert(schema.youtubeToken).values(input),
        ctx.currentUser,
        "socialaccounts",
      );
    }),

  getYoutubeAuthURl: protectedProcedure
    .input(SocialRedisKeySchema)
    .query(async ({ input, ctx }) => {
      const res = await verifyLimitAndRun({
        func: async () => {
          await redis.set(ctx.currentUser, input, {
            ex: 500,
          });
          return youtubeAuthUrl();
        },
        clerkUserId: ctx.currentUser,
        limitType: "socialaccounts",
      });
      return res;
    }),
  refreshYoutubeToken: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
        youtubeData: tokens.youtubeTokenInsertSchema,
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await refreshYoutubeDataInDatabase({
          youtubeData: input.youtubeData,
          tokenId: input.tokenId,
        });
        return {
          success: true,
          message: "Youtube Token refreshed successfully",
        };
      } catch (error) {
        return { success: false, message: "Error refreshing Twitter" };
      }
    }),

  postToYoutube: protectedProcedure
    .input(
      updateYoutubePostSchema.extend({
        shouldUpdate: z.boolean(),
        postId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let postId = "";

      if (input.shouldUpdate) {
        if (!input.postId) {
          throw new Error("postId is required to update");
        }
        console.log(input, "input update content from posting");

        const postUpdate = await updateYoutubeContent(input);
        postId = postUpdate.id;
      } else {
        const postSave = await saveYoutubeContent({
          ...input,
          video: input.video ?? " ",
          thumbnail: input.thumbnail ?? " ",
          title: input.title ?? " ",
          videoTags: input.videoTags ?? [],
          description: input.description ?? " ",
          userId: ctx.currentUser,
          updatedAt: new Date(),
        });

        postId = postSave.id;
      }
      const post = await postToYoutube(postId);
      return post;
    }),
});
