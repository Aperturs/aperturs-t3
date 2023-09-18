import { getAuth } from "@clerk/nextjs/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { Client } from "twitter-api-sdk";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

interface Response {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { state, code } = req.query;
  console.log("working twitter");
  console.log(userId, "userId");
  if (!userId) {
    console.log("I dont have user");
  }

  if (!state || !code) {
    return res.status(400).send("You denied the app or your session expired!");
  }
  const State = state as string;
  const [clientId, clientSecret] = State.split("-");
  const formattedClientId = clientId ? clientId.trim() : "";
  const formattedClientSecret = clientSecret ? clientSecret.trim() : "";

  const codeAuth = code as string;

  const bearerToken = Buffer.from(
    `${formattedClientId}:${formattedClientSecret}`
  ).toString("base64");

  await fetch("https://api.twitter.com/2/oauth2/token", {
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
  })
    .then(async (data) => {
      await data.json().then(async (response: Response) => {
        if (
          response.access_token &&
          response.refresh_token &&
          response.expires_in
        ) {
          const client = new Client(response.access_token);
          const { data: userObject } = await client.users.findMyUser({
            "user.fields": ["id"],
          });
          if (userId) {
            if (userObject) {
              //console.log(response.expires_in, "response.expires_in");
              await prisma.twitterToken
                .create({
                  data: {
                    access_token: response.access_token,
                    refresh_token: response.refresh_token,
                    expires_in: new Date(
                      new Date().getTime() + response.expires_in * 1000
                    ),
                    profileId: userObject.id,
                    client_id: formattedClientId,
                    client_secret: formattedClientSecret,
                    clerkUserId: userId,
                  },
                })
                .finally(() => {
                  console.log("working");
                });
            }
          } else {
            console.log("I dont have user");
          }
        }
      });
    })
    .catch((err) => {
      console.log("I am having error");
      console.log(err, "err");
    });

  res.redirect("/settings");
}
