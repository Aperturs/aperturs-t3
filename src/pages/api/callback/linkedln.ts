import { getAuth } from "@clerk/nextjs/dist/server";
import { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import cronJobServer from "~/server/cronjob";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const code = new URLSearchParams(req.query).get("code");
  const code = req.query.code;
  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=" +
      code +
      "&redirect_uri=" +
      encodeURIComponent(process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URL!) +
      "&client_id=" +
      process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID +
      "&client_secret=" +
      process.env.LINKEDIN_CLIENT_SECRET,
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
      Authorization: `Bearer ${data.access_token}`,
      "cache-control": "no-cache",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  }).catch(console.log);
  console.log({ userResponse });
  const user = await userResponse?.json();
  const session = getAuth(req);
  const caller = appRouter.createCaller({
    prisma: prisma,
    cronJobServer: cronJobServer,
    clerkId: session.userId,
  });

  await caller.user.addLinkedln({
    access_token: data.access_token,
    expires_in: new Date(new Date().getTime() + data.expires_in * 1000),
    profileId: user["id"],
    profileImage: user["profilePicture"]["displayImage"],
    vanityName: user["vanityName"],
    refresh_token: data.refresh_token ?? undefined,
    refresh_token_expires_in: data.refresh_token_expires_in ?? undefined,
  });

  return res.redirect("/dashboard");
}
