import type { tokens } from "@aperturs/db";
import type { SocialAccountsBackend } from "@aperturs/validators/user";
import { SocialType } from "@aperturs/validators/post";

import { getTwitterAccountDetails } from "./twitter";

export async function getAccounts(
  linkedin: tokens.linkedInTokenSelect[],
  twitter: tokens.twitterTokenSelect[],
): Promise<SocialAccountsBackend> {
  const accounts: SocialAccountsBackend = [];

  // Process Twitter data
  const twitterDetails = await getTwitterAccountDetails(twitter);
  console.log(twitterDetails, "twitterDetails");
  for (const twitterDetail of twitterDetails) {
    if (
      twitterDetail.tokenId &&
      twitterDetail.full_name &&
      twitterDetail.profile_image_url &&
      twitterDetail.profileId
    ) {
      accounts.push({
        data: {
          tokenId: twitterDetail.tokenId,
          name: twitterDetail.full_name,
          profile_image_url: twitterDetail.profile_image_url,
          profileId: twitterDetail.profileId,
        },
        type: SocialType.Twitter,
      });
    }
  }

  // Process LinkedIn data
  for (const linkedinDetail of linkedin) {
    if (
      linkedinDetail.id &&
      linkedinDetail.fullName &&
      linkedinDetail.profilePicture &&
      linkedinDetail.profileId
    ) {
      accounts.push({
        type: SocialType.Linkedin,
        data: {
          tokenId: linkedinDetail.id,
          name: linkedinDetail.fullName,
          profile_image_url: linkedinDetail.profilePicture,
          profileId: linkedinDetail.profileId,
        },
      });
    }
  }

  return accounts;
}
