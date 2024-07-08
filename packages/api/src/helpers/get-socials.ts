import type { tokens } from "@aperturs/db";
import type { SocialAccountsBackend } from "@aperturs/validators/user";
import { SocialTypes } from "@aperturs/validators/post";

import { getTwitterAccountDetails } from "./twitter";

export async function getAccounts(
  linkedin: tokens.linkedInTokenSelect[],
  twitter: tokens.twitterTokenSelect[],
  youtube: tokens.youtubeTokenSelect[],
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
          username: twitterDetail.username,
          connectedAt: twitterDetail.createdAt.toLocaleDateString(),
        },
        type: SocialTypes.TWITTER,
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
        type: SocialTypes.LINKEDIN,
        data: {
          tokenId: linkedinDetail.id,
          name: linkedinDetail.fullName,
          profile_image_url: linkedinDetail.profilePicture,
          profileId: linkedinDetail.profileId,
          connectedAt: linkedinDetail.createdAt.toLocaleDateString(),
        },
      });
    }
  }

  for (const youtubeDetail of youtube) {
    if (
      youtubeDetail.id &&
      youtubeDetail.channelName &&
      youtubeDetail.channelId
    ) {
      accounts.push({
        type: SocialTypes.YOUTUBE,
        data: {
          tokenId: youtubeDetail.id,
          name: youtubeDetail.channelName,
          profile_image_url: youtubeDetail.channelPicture ?? "",
          profileId: youtubeDetail.channelId,
          connectedAt: youtubeDetail.createdAt.toLocaleDateString(),
        },
      });
    }
  }

  return accounts;
}
