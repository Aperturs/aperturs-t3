/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  // const body = req.body;
  try {
    const response = await fetch(
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      "https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=" +
        code +
        "&redirect_uri=" +
        encodeURIComponent(env.NEXT_PUBLIC_LINKEDIN_CALLBACK_URL) +
        "&client_id=" +
        env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID +
        "&client_secret=" +
        env.LINKEDIN_CLIENT_SECRET,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(response, "response");
    const data = await response.json();
    console.log(data, "data");
    const userResponse = await fetch("https://api.linkedin.com/v2/me", {
      headers: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        Authorization: `Bearer ${data.access_token}`,
        "cache-control": "no-cache",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }).catch();
    // console.log({ userResponse });
    const user = await userResponse?.json();
    console.log(data, "data");
    // console.log({ user });
    if (user && userId) {
      await prisma.linkedInToken.create({
        data: {
          profileId: user["id"],
          access_token: data.access_token,
          refresh_token: data.refresh_token ?? undefined,
          expires_in: new Date(new Date().getTime() + data.expires_in * 1000),
          refresh_token_expires_in: data.refresh_token_expires_in ?? undefined,
          clerkUserId: userId,
        },
      });
      // await caller.user.addLinkedln({
      //   access_token: data.access_token,
      //   expires_in: new Date(new Date().getTime() + data.expires_in * 1000),
      //   profileId: user["id"],
      //   refresh_token: data.refresh_token ?? undefined,
      //   refresh_token_expires_in: data.refresh_token_expires_in ?? undefined,
      // });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/settings";
    return NextResponse.redirect(url);
  } catch (e) {
    console.log(e, "error");
    return;
  }
}

export function POST(req: NextRequest) {
  console.log("working this is get");
  const url = req.nextUrl.clone();
  url.pathname = "/settings";
  return NextResponse.redirect(url);
}
