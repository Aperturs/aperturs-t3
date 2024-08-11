/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

import type { SocialRedisKeyType } from "@aperturs/validators/socials";
import { redis } from "@aperturs/api";

import { env } from "~/env";
import { api } from "~/trpc/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  // const body = req.body;
  try {
    const response = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=" +
        code +
        "&redirect_uri=" +
        encodeURIComponent(env.LINKEDIN_CALLBACK_URL) +
        "&client_id=" +
        env.LINKEDIN_CLIENT_ID +
        "&client_secret=" +
        env.LINKEDIN_CLIENT_SECRET,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    console.log(response, "response");
    const data = await response.json();
    console.log(data, "data");
    const userResponse = await fetch(
      "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "cache-control": "no-cache",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      },
    ).catch();
    const user = await userResponse?.json();
    console.log(data, "data");
    console.log(user, "user");
    console.log(
      user.profilePicture.displayImage,
      "user.profilePicture.displayImage",
    );
    const profile_picture_url =
      user.profilePicture["displayImage~"].elements[0].identifiers[0]
        .identifier;
    console.log(profile_picture_url, "profile_picture_url");
    const firstName = user.firstName.localized.en_US;
    const lastName = user.lastName.localized.en_US;
    const fullName = `${firstName} ${lastName}`;

    if (user && userId) {
      if (
        !user.id ||
        !data.access_token ||
        // !data.refresh_token ||
        !data.expires_in ||
        // !data.refresh_token_expires_in ||
        !userId
      ) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      }
      const domain = env.DOMAIN;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const redisData = (await redis.get(userId))! as SocialRedisKeyType;
      console.log(redisData, "redisData");
      const isPersonal = redisData.orgId === "personal";
      const isNew = redisData.tokenId === "new";
      const isOnboarding = redisData.onboarding;
      if (isNew) {
        await api.linkedin.addLinkedlnToDatabase({
          profileId: user.id,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: new Date(new Date().getTime() + data.expires_in * 1000),
          refreshTokenExpiresIn: data.refresh_token_expires_in ?? undefined,
          clerkUserId: isPersonal ? userId : undefined,
          organizationId: isPersonal ? undefined : redisData.orgId,
          profileImage: profile_picture_url,
          fullName: fullName,
          updatedAt: new Date(),
          socialType: "LINKEDIN",
        });
      } else {
        await api.linkedin.refreshLinkedinToken({
          linkedinData: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: new Date(new Date().getTime() + data.expires_in * 1000),
            refreshTokenExpiresIn: data.refresh_token_expires_in ?? undefined,
            profileImage: profile_picture_url,
            fullName: fullName,
            profileId: user.id,
            socialType: "LINKEDIN",
            updatedAt: new Date(),
          },
          tokenId: redisData.tokenId,
        });
      }
      if (isPersonal) {
        if (isOnboarding) {
          const url = `${domain}/socials`;
          return NextResponse.redirect(url);
        }
        const url = `${domain}/socials`;
        return NextResponse.redirect(url);
      }
      const url = `${domain}/organisation/${redisData.orgId}/socials`;
      return NextResponse.redirect(url);
    }
    const url = `${env.DOMAIN}/onboarding/socials`;
    return NextResponse.redirect(url);
  } catch (e) {
    console.log(e, "error");
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export function POST(req: NextRequest) {
  console.log("working this is get");
  const url = req.nextUrl.clone();
  url.pathname = "/socials";
  return NextResponse.redirect(url);
}
