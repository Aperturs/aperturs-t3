import { type LinkedInToken } from "@prisma/client";
import axios from "axios";
import { prisma } from "~/server/db";
import { type PostToLinkedInInput } from "../../../types/post-types";
interface LinkedInTokenDetails
  extends Pick<LinkedInToken, "access_token" | "refresh_token" | "profileId"> {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: string;
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

export const postToLinkedin = async (input: PostToLinkedInInput) => {
  const tokenData = await prisma.linkedInToken.findUnique({
    where: {
      id: input.tokenId,
    },
    select: {
      access_token: true,
      profileId: true,
    },
  });
  const profileId = tokenData?.profileId;
  if (profileId) {
    try {
      const data = {
        author: `urn:li:person:${profileId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: input.content,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      axios
        .post("https://api.linkedin.com/v2/ugcPosts", data, {
          headers: {
            "X-Restli-Protocol-Version": "2.0.0",
            Authorization: `Bearer ${tokenData?.access_token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            return {
              success: true,
              message: "posted to linkedin",
              state: 200,
            };
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (err) {
      console.log("error", err);
    }
  } else {
    console.log("no profile id");
  }
};
