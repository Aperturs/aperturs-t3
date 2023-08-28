/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type TwitterToken } from "@prisma/client";
import Client from "twitter-api-sdk";
import { prisma } from "~/server/db";
import { type PostTweetInput } from "../types";

interface TwitterAccountDetails
  extends Pick<TwitterToken, "access_token" | "refresh_token" | "profileId"> {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: string;
}

export const getAccessToken = async (tokenId: string) => {
  const token = await prisma.twitterToken.findUnique({
    where: { id: tokenId },
  });
  if (token) {
    if (token.expires_in && token.refresh_token && token.access_token) {
      if (token.expires_in < new Date()) {
        const bearerToken = Buffer.from(
          `${token.client_id}:${token.client_secret}`
        ).toString("base64");

        const response = await fetch("https://api.twitter.com/2/oauth2/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${bearerToken}`,
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
          }),
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        if (data) {
          await prisma.twitterToken.update({
            where: {
              id: tokenId,
            },
            data: {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expires_in: new Date(
                new Date().getTime() + data.expires_in * 1000
              ),
            },
          });
        }
        return data.access_token;
      } else {
        return token.access_token;
      }
    }
  }
};
export const getTwitterAccountDetails = async (
  twitterTokens: TwitterToken[]
) => {
  const twitterDetails: TwitterAccountDetails[] = [];

  for (const twitterToken of twitterTokens) {
    const properAccessToken = await getAccessToken(twitterToken.id);
    const client = new Client(properAccessToken);
    const { data: userObject } = await client.users.findMyUser({
      "user.fields": ["username", "profile_image_url", "name"],
    });
    if (userObject && userObject.username && userObject.profile_image_url) {
      twitterDetails.push({
        tokenId: twitterToken.id,
        profileId: twitterToken.profileId,
        full_name: userObject.name,
        profile_image_url: userObject.profile_image_url,
        username: userObject.username,
      } as TwitterAccountDetails);
    }
  }
  return twitterDetails;
};

export const postToTwitter = async (
  input: PostTweetInput
) => {
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
  }
};
