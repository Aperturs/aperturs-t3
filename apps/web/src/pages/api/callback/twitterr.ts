import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { Client } from "twitter-api-sdk";

import { redis } from "@aperturs/api";

import { env } from "~/env.mjs";
import { api } from "~/trpc/server";

interface Response {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId, user } = getAuth(req);
  const { state, code } = req.query;
  console.log("working twitter");
  console.log(userId, "userId");
  if (!userId) {
    return res.status(400).send("You denied the app or your session expired!");
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
    `${formattedClientId}:${formattedClientSecret}`,
  ).toString("base64");
  // const heads = new Headers(headers);
  // const caller = createCaller({
  //   db: db,
  //   currentUser: userId,
  //   headers: req.headers,
  // });

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
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const id = (await redis.get(userId))! as string;
          const isPersonal = id === "personal";
          const { data: userObject } = await client.users.findMyUser({
            "user.fields": ["id"],
          });
          console.log(userObject, "userObject");
          if (userId) {
            if (userObject) {
              //console.log(response.expires_in, "response.expires_in");
              // await prisma.twitterToken
              //   .create({
              //     data: {
              //       access_token: response.access_token,
              //       refresh_token: response.refresh_token,
              //       expires_in: new Date(
              //         new Date().getTime() + response.expires_in * 1000,
              //       ),
              //       profileId: userObject.id,
              //       client_id: formattedClientId,
              //       client_secret: formattedClientSecret,
              //       clerkUserId: userId,
              //     },
              //   })
              await api.twitter.saveDataToDataBase({
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                expiresIn: new Date(
                  new Date().getTime() + response.expires_in * 1000,
                ),
                profileId: userObject.id,
                clientId: formattedClientId,
                clientSecret: formattedClientSecret,
                clerkUserId: isPersonal ? userId : undefined,
                organizationId: isPersonal ? undefined : id,
              });
              console.log("saving to database");

              // await db
              //   .insert(schema.twitterToken)
              //   .values({
              //     accessToken: response.access_token,
              //     refreshToken: response.refresh_token,
              //     expiresIn: new Date(
              //       new Date().getTime() + response.expires_in * 1000,
              //     ),
              //     profileId: userObject.id,
              //     clientId: formattedClientId,
              //     clientSecret: formattedClientSecret,
              //     clerkUserId: isPersonal ? userId : undefined,
              //     organizationId: isPersonal ? undefined : id,
              //   })
              //   .finally(() => {
              //     console.log("working");
              //   });
            }
          } else {
            console.log("I dont have user");
          }
          if (isPersonal) {
            res.redirect("/socials");
          }
          res.redirect(`/organisation/${id}/socials`);
        } else {
          res.status(400).send("You denied the app or your session expired!");
        }
      });
    })
    .catch((err) => {
      console.log("I am having error");
      console.log(err, "err");
    });

  res.redirect("/socials");
}
