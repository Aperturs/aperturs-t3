import { TRPCError } from "@trpc/server";
import { auth } from "twitter-api-sdk";
import { z } from "zod";
import { env } from "~/env.mjs";
import { ConnectSocial } from "../../helpers/misc";
import { postToTwitter } from "../../helpers/twitter";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { postTweetInputSchema } from "../../types";

export const twitterData = createTRPCRouter({
  postTweet: protectedProcedure
    .input(postTweetInputSchema)
    .mutation(async ({ input }) => {
      try {
        await postToTwitter( input);
        return { success: true, message: "Tweeted successfully" };
      } catch (error) {
        return { success: false, message: "Error tweeting" };
      }
    }),

  addTwitter: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        clientSecret: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const canConnect = await ConnectSocial({ user: ctx.currentUser });
      if (canConnect) {
        const authClient = new auth.OAuth2User({
          client_id: input.clientId,
          client_secret: input.clientSecret,
          callback: env.TWITTER_CALLBACK_URL,
          scopes: [
            "users.read",
            "tweet.read",
            "offline.access",
            "tweet.write",
            "follows.read",
            "follows.write",
            "like.write",
            "list.read",
            "list.write",
            "bookmark.read",
            "bookmark.write",
          ],
        });
        const url = authClient.generateAuthURL({
          state: `${input.clientId}-${input.clientSecret}`,
          // state: org.id.toString(),
          code_challenge_method: "plain",
          code_challenge: "challenge",
        });

        return url;
      } else {
        throw new TRPCError({
          message: "Upgrade to higher plan to connect more Socials",
          code: "FORBIDDEN",
        });
      }
    }),

  removeTwitter: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.twitterToken.delete({
          where: {
            id: input.tokenId,
          },
        });
        return { success: true, message: "Twitter removed successfully" };
      } catch (error) {
        return { success: false, message: "Error removing Twitter" };
      }
    }),
});
