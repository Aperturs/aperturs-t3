import { type LinkedInToken } from "@prisma/client";
interface LinkedInTokenDetails
  extends Pick<LinkedInToken, "access_token" | "refresh_token" | "profileId"> {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: number;
}
export const getLinkedinAccountDetails = async (
  linkedinTokens: LinkedInToken[]
) => {
  const linkedinDetails: LinkedInTokenDetails[] = [];
  for (const linkedinToken of linkedinTokens) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      tokenId: linkedinToken.id,
      access_token: linkedinToken.access_token,
      refresh_token: linkedinToken.refresh_token,
      profileId: linkedinToken.profileId,
      full_name:
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-member-access
        userObject.localizedFirstName + " " + userObject.localizedLastName,
    });
  }
  return linkedinDetails;
};
