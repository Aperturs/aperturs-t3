import { getAuth } from "@clerk/nextjs/dist/server";
import { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import cronJobServer from "~/server/cronjob";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state, code } = req.query;
  console.log("state", state);
  console.log("code", code);
  const org = await prisma.twitterToken.findUnique({
    where: {
      id: parseInt(state as string),
    },
    select: {
      client_id: true,
      client_secret: true,
      codeVerifier: true,
    },
  });

  if (!org?.codeVerifier || !state || !code) {
    return res.status(400).send("You denied the app or your session expired!");
  }
  const client = new TwitterApi({
    clientId: org.client_id,
    clientSecret: org.client_secret,
  });

  const codeVerifier = org.codeVerifier;
  const codeAuth = code as string;

  client
    .loginWithOAuth2({
      code: codeAuth,
      codeVerifier,
      redirectUri: env.TWITTER_CALLBACK_URL,
    })
    .then(
      async ({
        client: loggedClient,
        accessToken,
        refreshToken,
        expiresIn,

      }) => {

        // {loggedClient} is an authenticated client in behalf of some user
        // Store {accessToken} somewhere, it will be valid until {expiresIn} is hit.
        // If you want to refresh your token later, store {refreshToken} (it is present if 'offline.access' has been given as scope)

        // Example request
        const { data: userObject } = await loggedClient.v2.me();

        await prisma.twitterToken.update({
          where: {
            id: parseInt(state as string),
          },
          data: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: new Date(new Date().getTime() + expiresIn * 1000),
            profileId: userObject.id,
            userName: userObject.username,
            profileImage: userObject.profile_image_url,
          },
        });
      }
      
    )
    .catch((error) => {console.log(error),res.status(403).send("Invalid verifier or access tokens!")});

  // const code = new URLSearchParams(req.query).get("code")
  res.redirect("/settings");
}
