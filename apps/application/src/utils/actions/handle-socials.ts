"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import type {
  addTwitterType,
  SocialRedisKeyType,
} from "@aperturs/validators/socials";
import { redis } from "@aperturs/api";

import { env } from "~/env";
import { api } from "~/trpc/server";

export async function handleLinkedinRedirect({
  orgId,
  tokenId,
  onboarding,
}: SocialRedisKeyType) {
  const url = await api.linkedin.getLinkedinAuthUrl({
    orgId,
    tokenId,
    onboarding,
  });
  console.log(url, "url");
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

export async function handleInstagramRedirect({
  orgId,
  tokenId,
}: SocialRedisKeyType) {
  const url = await api.instagram.getInstagramRedirectUrl({ orgId, tokenId });
  redirect(url);
}

// export async function handleYoutubeRedirect({
//   orgId,
//   tokenId,
// }: SocialRedisKeyType) {
//   const url = await api.youtube.getYoutubeAuthURl({ orgId, tokenId });
//   redirect(url);
// }
