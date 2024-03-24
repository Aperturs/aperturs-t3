import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

import type { SocialRedisKeyType } from "@aperturs/validators/socials";
import { googleAuth2Client, redis, youtubeClient } from "@aperturs/api";

import { env } from "~/env";
import { api } from "~/trpc/server";

async function handler(req: NextRequest) {
  const { userId } = getAuth(req);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  //   const { state, code } = req.query;
  console.log(userId, "userId");
  if (!userId) {
    // return res.status(400).send("You denied the app or your session expired!");
    return NextResponse.json(
      { error: "You denied the app or your session expired!" },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Did not recieve code" },
      { status: 400 },
    );
    // return res.status(400).send("You denied the app or your session expired!");
  }
  const { tokens } = await googleAuth2Client.getToken(code);
  console.log(tokens, "tokens");
  if (!tokens.refresh_token) {
    throw new Error("Unable to retrieve the refresh token.");
  }
  if (!tokens.access_token) {
    throw new Error("Unable to retrieve the access token.");
  }
  if (!tokens.expiry_date) {
    throw new Error("Unable to retrieve the expiry date.");
  }

  googleAuth2Client.setCredentials(tokens);
  const response = await youtubeClient.channels.list({
    part: ["snippet", "statistics", "brandingSettings"],
    mine: true,
  });

  const channelData = response.data.items?.[0];
  const channelId = channelData?.id ?? "";
  console.log(channelData, "channelId");
  console.log(channelData?.brandingSettings, "brand");
  console.log(channelData?.snippet, "snip");

  if (!channelId) {
    throw new Error("Unable to retrieve the YouTube channel ID.");
  }

  if (!channelData?.snippet?.title) {
    throw new Error("Unable to retrieve the YouTube channel name");
  }

  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const redisData = (await redis.get(userId)) as SocialRedisKeyType;
  if (!redisData) {
    return NextResponse.json(
      { error: "Please try again you took too much time for the request" },
      { status: 400 },
    );
  }
  const isPersonal = redisData.orgId === "personal";
  const isNew = redisData.tokenId === "new";
  const domain = env.DOMAIN;

  if (isNew) {
    await api.youtube.addYoutubeToDatabase({
      channelId: channelId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: new Date(tokens.expiry_date),
      clerkUserId: isPersonal ? userId : undefined,
      organizationId: isPersonal ? undefined : redisData.orgId,
      channelPicture: channelData?.snippet?.thumbnails?.medium?.url,
      channelName: channelData?.snippet?.title,
      updatedAt: new Date(),
    });
  } else {
    await api.youtube.refreshYoutubeToken({
      tokenId: redisData.tokenId,
      youtubeData: {
        channelId: channelId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: new Date(tokens.expiry_date),
        channelName: channelData?.snippet?.title,
        channelPicture: channelData?.snippet?.thumbnails?.medium?.url,
        updatedAt: new Date(),
      },
    });
  }
  if (isPersonal) {
    const url = `${domain}/socials`;
    return NextResponse.redirect(url);
  }
  const url = `${domain}/organisation/${redisData.orgId}/socials`;
  return NextResponse.redirect(url);
}

export const POST = handler;
export const GET = handler;
export const PUT = handler;
