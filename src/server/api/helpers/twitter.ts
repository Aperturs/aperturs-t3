import { PrismaClient, TwitterToken } from "@prisma/client";
import Client from "twitter-api-sdk";
import { prisma } from "~/server/db";

export interface TwitterAccountDetails
  extends Pick<TwitterToken, "access_token" | "refresh_token" | "profileId"> {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: number;
}

export const getAccessToken = async (tokenId: number) => {
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
        const data = await response.json();
        await prisma.twitterToken.update({
          where: {
            id: tokenId,
          },
          data: {
            access_token: data.access_token,
            expires_in: new Date(new Date().getTime() + data.expires_in * 1000),
          },
        });
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
    console.log(twitterDetails, "twitterDetails")
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
