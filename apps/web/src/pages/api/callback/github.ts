/* eslint-disable */

import { type NextApiRequest, type NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

// interface TokenData {
//   access_token: string;
//   // add other properties you expect in the response
// }

// interface UserObject {
//   login: string;
//   // add other properties you expect in the response
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code } = req.query;
  const tokenData = await (
    await fetch(
      `https://github.com/login/oauth/access_token?client_id=${env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${env.GITHUB_CLIENT_SECRET}&code=${code}`,
      {
        headers: {
          Accept: "application/json",
        },
        method: "POST",
      },
    )
  ).json();

  const userObject: GithubUser = await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
      },
    })
  ).json();

  const { userId } = getAuth(req);

  if (userObject && userId) {
    await prisma.githubToken.create({
      data: {
        clerkUserId: userId,
        access_token: tokenData.access_token,
        expires_in: null,
        profileId: userObject.login,
      },
    });
  } else {
    console.log("no user object");
  }
  return res.redirect("/settings");
}
