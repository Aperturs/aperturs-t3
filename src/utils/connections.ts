import { env } from "~/env.mjs";

export const onLinkedLnConnect = () => {
  console.log(" linkedln Connect");
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!}&redirect_uri=${
    env.NEXT_PUBLIC_LINKEDIN_CALLBACK_URL
  }&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
};
export const onGithubConnect = () => {
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(env.NEXT_PUBLIC_GITHUB_CALLBACK_URL)}&scope=${encodeURIComponent(
    "user repo"
  )}`;
};
