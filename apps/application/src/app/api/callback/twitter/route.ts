import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Client } from "twitter-api-sdk";

import type { SocialRedisKeyType } from "@aperturs/validators/socials";
import { redis } from "@aperturs/api";

import { env } from "~/env";
import { api } from "~/trpc/server";

interface Response {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

async function handler(req: NextRequest) {
  const { userId } = getAuth(req);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  //   const { state, code } = req.query;
  console.log("working twitter");
  console.log(userId, "userId");
  if (!userId) {
    // return res.status(400).send("You denied the app or your session expired!");
    return NextResponse.json(
      { error: "You didn't signin, please signin" },
      { status: 400 },
    );
  }

  if (!state || !code) {
    return NextResponse.json(
      { error: "You denied the app or your session expired!" },
      { status: 400 },
    );
    // return res.status(400).send("You denied the app or your session expired!");
  }
  const State = state;
  const [clientId, clientSecret] = State.split("-");
  const formattedClientId = clientId ? clientId.trim() : "";
  const formattedClientSecret = clientSecret ? clientSecret.trim() : "";

  const codeAuth = code;

  const bearerToken = Buffer.from(
    `${formattedClientId}:${formattedClientSecret}`,
  ).toString("base64");
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const redisData = (await redis.get(userId))! as SocialRedisKeyType;
  const isPersonal = redisData.orgId === "personal";
  const isNew = redisData.tokenId === "new";
  const isOnboarding = redisData.onboarding;

  if (!redisData.orgId || !redisData.tokenId) {
    return NextResponse.json(
      { error: "Failed to Understand where you are connecting" },
      { status: 400 },
    );
  }
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

          console.log("I am having orgid", redisData.orgId);
          const { data: userObject } = await client.users.findMyUser({
            "user.fields": ["username", "profile_image_url", "name", "id"],
          });
          if (userId) {
            if (userObject) {
              console.log("I have user", userObject);
              if (isNew) {
                await api.twitter.saveDataToDataBase({
                  accessToken: response.access_token,
                  refreshToken: response.refresh_token,
                  expiresIn: new Date(
                    new Date().getTime() + response.expires_in * 1000,
                  ),
                  fullname: userObject.name,
                  username: userObject.username,
                  profileImage: userObject.profile_image_url,
                  profileId: userObject.id,
                  clientId: formattedClientId,
                  clientSecret: formattedClientSecret,
                  clerkUserId: isPersonal ? userId : undefined,
                  organizationId: isPersonal ? undefined : redisData.orgId,
                });
              } else {
                await api.twitter.refreshTwitterToken({
                  tokenData: {
                    accessToken: response.access_token,
                    refreshToken: response.refresh_token,
                    expiresIn: new Date(
                      new Date().getTime() + response.expires_in * 1000,
                    ),
                    fullname: userObject.name,
                    username: userObject.username,
                    profileImage: userObject.profile_image_url,
                    profileId: userObject.id,
                    clientId: formattedClientId,
                    clientSecret: formattedClientSecret,
                    updatedAt: new Date(),
                  },
                  tokenId: redisData.tokenId,
                });
              }
            } else {
              console.log("I dont have userObject");
              return NextResponse.json(
                { error: "Invalid data, Dont have User Object" },
                { status: 400 },
              );
            }
          } else {
            console.log("I dont have user");
            return NextResponse.json(
              { error: "Invalid data, Dont have User " },
              { status: 400 },
            );
          }
        }
      });
    })
    .catch((err) => {
      console.log("I am having error");
      console.log(err, "err");
      return NextResponse.json({ error: "Have some Error" }, { status: 400 });
    });
  if (isPersonal) {
    console.log("I am personal");
    if (isOnboarding) {
      const url = `${env.DOMAIN}/onboard/add-social`;
      return NextResponse.redirect(url);
    }
    const url = `${env.DOMAIN}/socials`;
    return NextResponse.redirect(url);
  }
  console.log("I am not personal");
  const urlOrg = `${env.DOMAIN}/organisation/${redisData.orgId}/socials`;
  return NextResponse.redirect(urlOrg);
  //   const url = `${env.DOMAIN}/socials`;
  //   return NextResponse.redirect(url);
}

export const POST = handler;
export const GET = handler;
export const PUT = handler;
