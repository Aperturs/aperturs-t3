/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { auth } from "@clerk/nextjs";
import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const code = new URLSearchParams(req.query).get("code");
  const code = req.query.code;
  const { userId } = auth();
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
  const data = await response.json();
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

  return res.redirect("/settings");
}
