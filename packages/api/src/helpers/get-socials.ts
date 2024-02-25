import type { tokens } from "@aperturs/db";
import type { SocialAccountsBackend } from "@aperturs/validators/user";
import { SocialType } from "@aperturs/validators/post";

export function getAccounts(
  linkedin: tokens.linkedInTokenSelect[],
  twitter: tokens.twitterTokenSelect[],
): SocialAccountsBackend {
  const accounts: SocialAccountsBackend = [];

  // Process Twitter data
  for (const twitterDetail of twitter) {
    if (
      twitterDetail.id &&
      twitterDetail.fullname &&
      twitterDetail.profileImage &&
      twitterDetail.profileId
    ) {
      accounts.push({
        data: {
          tokenId: twitterDetail.id,
          name: twitterDetail.fullname,
          profile_image_url: twitterDetail.profileImage,
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
