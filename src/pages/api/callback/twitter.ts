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
  // const org = await prisma.twitterToken.findUnique({
  //   where: {
  //     id: parseInt(state as string),
  //   },
  //   select: {
  //     client_id: true,
  //     client_secret: true,
  //   },
  // });

  if ( !state || !code) {
    return res.status(400).send("You denied the app or your session expired!");
  }
  const State = state as string;
  const [clientId, clientSecret] = State.split("-");
  const formattedClientId = clientId ? clientId.trim() : "";
  const formattedClientSecret = clientSecret ? clientSecret.trim() : "";
  const {userId } =  getAuth(req);
  const client = new TwitterApi({
    clientId: formattedClientId,
    clientSecret: formattedClientSecret,
  });
  const codeAuth = code as string;

  const bearerToken = Buffer.from(
    `${formattedClientId}:${formattedClientSecret}`
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
          "user.fields": ["id"],
        });
        console.log(userObject, "userObject");
        if(userId){
        if (userObject) {
          console.log(response.expires_in, "response.expires_in");
          await prisma.twitterToken.create({
            data:{
              access_token: response.access_token,
              refresh_token: response.refresh_token,
              expires_in: new Date(
                        new Date().getTime() + response.expires_in * 1000
                      ),
              profileId: userObject.id,
              client_id: formattedClientId,
              client_secret: formattedClientSecret,
              clerkUserId: userId,
            }
          })
          // await prisma.twitterToken
          //   .update({
          //     where: {
          //       id: parseInt(state as string),
          //     },
          //     data: {
          //       access_token: response.access_token,
          //       refresh_token: response.refresh_token,
          //       expires_in: new Date(
          //         new Date().getTime() + response.expires_in * 1000
          //       ),
          //       profileId: userObject.id,
          //     },
          //   })
          // 
          //   });
        }
      }
      }
    });
  });

  res.redirect("/settings");
}
