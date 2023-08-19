import { TRPCError } from "@trpc/server";
import { Client, auth } from "twitter-api-sdk";
import { z } from "zod";
import { env } from "~/env.mjs";
import { getAccessToken } from "../../helpers";
import { ConnectSocial } from "../../helpers/misc";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const twitterData = createTRPCRouter({
  postTweet: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
        tweets: z.array(
          z.object({
            id: z.number(),
            text: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const accessToken = (await getAccessToken(input.tokenId)) as string;

      const client = new Client(accessToken);

      try {
        if (input.tweets[0] && input.tweets.length > 0) {
          // Post the first tweet
          const firstTweet = await client.tweets.createTweet({
            text: input.tweets[0].text,
          });

          if (firstTweet.data) {
            let previousTweetId = firstTweet.data.id;
            // Loop through the rest of the tweets
            for (let i = 1; i < input.tweets.length; i++) {
              const tweet = input.tweets[i];
              if (tweet) {
                const post = await client.tweets.createTweet({
                  text: tweet.text,
                  reply: {
                    in_reply_to_tweet_id: previousTweetId,
                  },
                });
                if (post.data) {
                  previousTweetId = post.data.id;
                } else {
                  console.log("error");
                  return;
                }
              }
            }
          }
          return { success: true, message: "Tweeted successfully", state: 200 };
        }
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
