/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import Client from "twitter-api-sdk";

import type { tokens } from "@aperturs/db";
import type { PostTweetInput } from "@aperturs/validators/post";
import { db, eq, schema } from "@aperturs/db";

interface TwitterAccountDetails
  extends Pick<
    tokens.twitterTokenSelect,
    "accessToken" | "refreshToken" | "profileId"
  > {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: string;
}

export const getAccessToken = async (tokenId: string) => {
  const token = await db.query.twitterToken.findFirst({
    where: eq(schema.twitterToken.id, tokenId),
  });
  if (token) {
    if (token.expiresIn && token.refreshToken && token.accessToken) {
      if (token.expiresIn < new Date()) {
        const bearerToken = Buffer.from(
          `${token.clientId}:${token.clientSecret}`,
        ).toString("base64");
        try {
          const response = await fetch(
            "https://api.twitter.com/2/oauth2/token",
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${bearerToken}`,
              },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
              }),
            },
          );

          const data = await response.json();
          if (data) {
            await db
              .update(schema.twitterToken)
              .set({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: new Date(
                  new Date().getTime() + data.expires_in * 1000,
                ),
              })
              .where(eq(schema.twitterToken.id, tokenId));
          }
          return data.access_token;
        } catch (err) {
          console.log(err);
        }
      } else {
        return token.accessToken;
      }
    }
  }
};
export const getTwitterAccountDetails = async (
  twitterTokens: tokens.twitterTokenSelect[],
) => {
  const twitterDetails: TwitterAccountDetails[] = [];

  for (const twitterToken of twitterTokens) {
    if (
      !twitterToken.fullname ||
      !twitterToken.profileImage ||
      !twitterToken.username ||
      (twitterToken.expiresIn && twitterToken.expiresIn < new Date())
    ) {
      const properAccessToken = await getAccessToken(twitterToken.id);
      const client = new Client(properAccessToken);
      const { data: userObject } = await client.users.findMyUser({
        "user.fields": ["username", "profile_image_url", "name"],
      });
      if (userObject?.username && userObject.profile_image_url) {
        twitterDetails.push({
          tokenId: twitterToken.id,
          profileId: twitterToken.profileId,
          full_name: userObject.name,
          profile_image_url: userObject.profile_image_url,
          username: userObject.username,
        } as TwitterAccountDetails);
        await db
          .update(schema.twitterToken)
          .set({
            username: userObject.username,
            profileImage: userObject.profile_image_url,
            fullname: userObject.name,
          })
          .where(eq(schema.twitterToken.id, twitterToken.id));
      }
    } else {
      twitterDetails.push({
        tokenId: twitterToken.id,
        profileId: twitterToken.profileId,
        full_name: twitterToken.fullname,
        profile_image_url: twitterToken.profileImage,
        username: twitterToken.username,
      } as TwitterAccountDetails);
    }
  }
  return twitterDetails;
};

export const postToTwitter = async (input: PostTweetInput) => {
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
    }
  } catch (err) {
    console.log(err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error posting to twitter",
      cause: err,
    });
  }
};
