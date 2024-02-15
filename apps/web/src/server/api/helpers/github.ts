import { type GithubToken } from "@prisma/client";

interface GithubTokenDetails
  extends Pick<GithubToken, "access_token" | "refresh_token" | "profileId"> {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: string;
}

export const getGithubAccountDetails = async (githubTokens: GithubToken[]) => {
  const githubTokenDetails: GithubTokenDetails[] = [];
  for (const githubToken of githubTokens) {
    const userObject: GithubUser = (await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${githubToken.access_token}`,
        },
      })
    ).json()) as GithubUser;
    githubTokenDetails.push({
      access_token: githubToken.access_token,
      refresh_token: githubToken.refresh_token,
      full_name: userObject.name,
      profileId: githubToken.profileId,
      tokenId: githubToken.id,
      username: userObject.login,
      profile_image_url: userObject.avatar_url,
    });
  }
  return githubTokenDetails;
};
