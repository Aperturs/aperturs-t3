"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import type { addTwitterType } from "@aperturs/validators/socials";
import { redis } from "@aperturs/api";

import { env } from "~/env.mjs";
import { api } from "~/trpc/server";

export async function handleLinkedinRedirect({
  orgId,
  tokenId,
}: {
  orgId: string;
  tokenId?: string;
}) {
  const url = await api.linkedin.getLinkedinAuthUrl({ orgId, tokenId });
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

export async function handleTwitterRedirect(input: addTwitterType) {
  const url = await api.twitter.getTwitterUrl(input);
  redirect(url);
}
