import {
  GetTwitterConnectUrl,
  saveTwitterDataToDatabase,
} from "@api/handlers/twitter/main";
import { verifyLimitAndRun } from "@api/helpers/limitWrapper";
import { redis } from "@api/index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, schema, tokens } from "@aperturs/db";
import { postTweetInputSchema } from "@aperturs/validators/post";
import { addTwitterSchema } from "@aperturs/validators/socials";

import { postToTwitter } from "../../helpers/twitter";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const twitterData = createTRPCRouter({
  postTweet: protectedProcedure
    .input(postTweetInputSchema)
    .mutation(async ({ input }) => {
      try {
        await postToTwitter(input);
        return { success: true, message: "Tweeted successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error tweeting",
        });
      }
    }),

  getTwitterUrl: protectedProcedure
    .input(addTwitterSchema)
    .query(({ input, ctx }) => {
      const res = verifyLimitAndRun({
        func: async () => {
          await redis.set(ctx.currentUser, input.orgId, {
            ex: 120,
          });
          return GetTwitterConnectUrl(input);
        },
        clerkUserId: ctx.currentUser,
        limitType: "socialaccounts",
      });
      return res;
    }),

  saveDataToDataBase: protectedProcedure
    .input(tokens.twitterTokenInsertSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("saving data", input);
      await saveTwitterDataToDatabase({
        twitterData: input,
        userId: ctx.currentUser,
      });
    }),

  removeTwitter: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .delete(schema.twitterToken)
          .where(eq(schema.twitterToken.id, input.tokenId));
        return { success: true, message: "Twitter removed successfully" };
      } catch (error) {
        return { success: false, message: "Error removing Twitter" };
      }
    }),
});
