import { PrismaClient, LinkedInToken } from "@prisma/client";
export interface TwitterAccountDetails
  extends Pick<LinkedInToken, "access_token" | "refresh_token" | "profileId"> {
  full_name: string;
  username?: string;
  profile_image_url?: string;
}
export const getLinkedinAccountDetails = async (
  linkedinTokens: LinkedInToken[]
) => {
  const linkedinDetails: TwitterAccountDetails[] = [];
  console.log(
    { linkedinTokens },
    "ksdjfldddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
  );
  for (const linkedinToken of linkedinTokens) {
    const userObject = await (
      await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${linkedinToken.access_token}`,
          "cache-control": "no-cache",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      })
    ).json();

    linkedinDetails.push({
      access_token: linkedinToken.access_token,
      refresh_token: linkedinToken.refresh_token,
      profileId: linkedinToken.profileId,
      full_name:
        userObject.localizedFirstName + " " + userObject.localizedLastName,
    });
  }
  return linkedinDetails;
};