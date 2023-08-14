import { Client } from "twitter-api-sdk";
import { z } from "zod";
import { getAccessToken } from "../../helpers";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const twitterData = createTRPCRouter({
  postTweet: protectedProcedure
    .input(
      z.object({
        tokenId: z.number(),
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
      console.log("accessToken", accessToken);

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
        console.log("error");
        return { success: false, message: "Error tweeting" };
      }
    }),
});
