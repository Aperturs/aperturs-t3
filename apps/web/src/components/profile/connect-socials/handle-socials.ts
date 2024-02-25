"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { redis } from "@aperturs/api";

import { env } from "~/env.mjs";

export async function handleLinkedinRedirect({ orgId }: { orgId: string }) {
  const { userId } = auth();
  console.log(userId, "userId");
  if (!userId) {
    return redirect("/login");
  }
  await redis.set(userId, orgId);
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${env.LINKEDIN_CLIENT_ID}&redirect_uri=${env.LINKEDIN_CALLBACK_URL}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  redirect(url);
}

export async function handleGithubRedirect({ orgId }: { orgId: string }) {
  const { userId } = auth();
  console.log(userId, "userId");
  if (!userId) {
    return redirect("/login");
  }
  await redis.set(userId, orgId);
  const url = `https://github.com/login/oauth/authorize?client_id=${
    env.GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    env.GITHUB_CALLBACK_URL,
  )}&scope=${encodeURIComponent("user repo")}`;
  redirect(url);
}
