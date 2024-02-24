import { env } from "~/env.mjs";

export const onGithubConnect = () => {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    env.NEXT_PUBLIC_GITHUB_CALLBACK_URL,
  )}&scope=${encodeURIComponent("user repo")}`;
};
