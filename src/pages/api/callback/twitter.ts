import { getAuth } from "@clerk/nextjs/dist/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Client, auth } from "twitter-api-sdk";
import { TwitterApi } from "twitter-api-v2";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state, code, codeVerifier } = req.query;
  console.log("state", state);
  console.log("code", code);

  const org = await prisma.twitterToken.findUnique({
    where: {
      id: parseInt(state as string),
    },
    select: {
      client_id: true,
      client_secret: true,
    },
  });

  if (!org || !state || !code) {
    return res.status(400).send("You denied the app or your session expired!");
  }
  const client = new TwitterApi({
    clientId: org.client_id,
    clientSecret: org.client_secret,
  });
  const codeAuth = code as string;
  const authClient = new auth.OAuth2User({
    client_id: org.client_id,
    client_secret: org.client_secret,
    callback: env.TWITTER_CALLBACK_URL,
    scopes: ["users.read", "tweet.read", "offline.access"],
  });

  const bearerToken = Buffer.from(
    `${org.client_id}:${org.client_secret}`
  ).toString("base64");

  fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${bearerToken}`,
    },
    body: new URLSearchParams({
      code: codeAuth,
      grant_type: "authorization_code",
      redirect_uri: env.TWITTER_CALLBACK_URL,
      code_verifier: "challenge",
    }),
  }).then(async (data) => {
    data.json().then(async (response) => {
      console.log(response, "response");
      if (
        response.access_token &&
        response.refresh_token &&
        response.expires_in
      ) {
        const client = new Client(response.access_token);
        const { data: userObject } = await client.users.findMyUser({
          "user.fields": ["profile_image_url", "username", "id"],
        });
        console.log(userObject, "userObject");

        if (userObject) {
          console.log(response.expires_in, "response.expires_in")
          await prisma.twitterToken.update({
            where: {
              id: parseInt(state as string),
            },
            data: {
              access_token: response.access_token,
              refresh_token: response.refresh_token,
              expires_in: new Date(
                new Date().getTime() + response.expires_in * 1000
              ),
              profileId: userObject.id,
              userName: userObject.username,
              profileImage: userObject.profile_image_url,
            },
          });
        }
      }
    });
  });


  res.redirect("/settings");
}
