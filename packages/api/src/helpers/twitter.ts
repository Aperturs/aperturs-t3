/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { Client } from "twitter-api-sdk";
import { TwitterApi } from "twitter-api-v2";

import type { tokens } from "@aperturs/db";
import type { PostTweetInput } from "@aperturs/validators/post";
import { db, eq, schema } from "@aperturs/db";
import { getFileType } from "@aperturs/validators/post";

import { env } from "../../env";

interface TwitterAccountDetails
  extends Pick<
    tokens.twitterTokenSelect,
    "accessToken" | "refreshToken" | "profileId" | "createdAt"
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
          console.log("new Token", data);
          if (data) {
            await db
              .update(schema.twitterToken)
              .set({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: new Date(
                  new Date().getTime() + data.expires_in * 1000,
                ),
                updatedAt: new Date(),
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

export const getAccessTokenAndProfile = async (tokenId: string) => {
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
          console.log("new Token", data);
          if (data) {
            await db
              .update(schema.twitterToken)
              .set({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresIn: new Date(
                  new Date().getTime() + data.expires_in * 1000,
                ),
                updatedAt: new Date(),
              })
              .where(eq(schema.twitterToken.id, tokenId));
          }
          return { ...token, accessToken: data.access_token };
        } catch (err) {
          console.log(err);
        }
      } else {
        return token;
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
          createdAt: twitterToken.createdAt,
        } as TwitterAccountDetails);
        await db
          .update(schema.twitterToken)
          .set({
            username: userObject.username,
            profileImage: userObject.profile_image_url,
            fullname: userObject.name,
            updatedAt: new Date(),
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
        createdAt: twitterToken.createdAt,
      } as TwitterAccountDetails);
    }
  }
  return twitterDetails;
};

export const postToTwitter = async (input: PostTweetInput) => {
  const profile = (await getAccessTokenAndProfile(
    input.tokenId,
  )) as tokens.twitterTokenSelect;
  const client = new Client(profile.accessToken);
  try {
    if (input.tweets[0] && input.tweets.length > 0) {
      const mediaIds = await Promise.all(
        input.tweets[0].uploadedFiles?.map((url) =>
          uploadMedia(url, profile.profileId),
        ) ?? [],
      );
      const firstTweet = await client.tweets.createTweet({
        text: input.tweets[0].content,
        media: {
          media_ids: mediaIds,
        },
      });

      if (firstTweet.data) {
        let previousTweetId = firstTweet.data.id;
        // Loop through the rest of the tweets
        for (let i = 1; i < input.tweets.length; i++) {
          const tweet = input.tweets[i];
          const mediaIds = tweet?.uploadedFiles
            ? await Promise.all(
                tweet.uploadedFiles.map((url) =>
                  uploadMedia(url, profile.profileId),
                ),
              )
            : [];
          if (tweet) {
            const post = await client.tweets.createTweet({
              text: tweet.content,
              reply: {
                in_reply_to_tweet_id: previousTweetId,
              },
              media: {
                media_ids: mediaIds,
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

export async function uploadMedia(
  fileUrl: string,
  profileId: string,
): Promise<string> {
  try {
    // Stream the file from the provided URL
    const fileResponse = await axios({
      method: "get",
      url: fileUrl,
      responseType: "arraybuffer",
    });
    const fileType = fileUrl.split(".").pop();

    const v1Client = new TwitterApi({
      appKey: env.TWITTER_APIKEY,
      appSecret: env.TWITTER_APPSECRET,
      accessToken: env.TWITTER_ACCESSTOKEN,
      accessSecret: env.AWS_SECRET_ACCESS_KEY,
    });

    const mimeType = getFileType(fileUrl);
    const mediaId = await v1Client.v1.uploadMedia(fileResponse.data, {
      mimeType: mimeType + "/" + fileType,
      additionalOwners: [profileId],
    });

    return mediaId;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw new Error("Failed to upload media");
  }
}
