import type { tokens } from "@aperturs/db";
import type { GithubUser } from "@aperturs/validators/github";

interface GithubTokenDetails
  extends Pick<
    tokens.githubTokenSelect,
    "accessToken" | "refreshToken" | "profileId"
  > {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: string;
}

export const getGithubAccountDetails = async (
  githubTokens: tokens.githubTokenSelect[],
) => {
  const githubTokenDetails: GithubTokenDetails[] = [];
  for (const githubToken of githubTokens) {
    const userObject: GithubUser = (await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${githubToken.accessToken}`,
        },
      })
    ).json()) as GithubUser;
    githubTokenDetails.push({
      accessToken: githubToken.accessToken,
      refreshToken: githubToken.refreshToken,
      full_name: userObject.name,
      profileId: githubToken.profileId,
      tokenId: githubToken.id,
      username: userObject.login,
      profile_image_url: userObject.avatar_url,
    });
  }
  return githubTokenDetails;
};
