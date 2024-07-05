/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { uploadMedia } from "@api/handlers/linkedin/upload-media";
import axios from "axios";

import type { tokens } from "@aperturs/db";
import type { BasePostContentType } from "@aperturs/validators/post";
import { db, eq, schema } from "@aperturs/db";
import { allowedImageTypes, videoTypes } from "@aperturs/validators/post";

interface LinkedInTokenDetails
  extends Pick<
    tokens.linkedInTokenSelect,
    "accessToken" | "refreshToken" | "profileId"
  > {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: string;
}
export const getLinkedinAccountDetails = async (
  linkedinTokens: tokens.linkedInTokenSelect[],
) => {
  const linkedinDetails: LinkedInTokenDetails[] = [];
  for (const linkedinToken of linkedinTokens) {
    const userObject = await (
      await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${linkedinToken.accessToken}`,
          "cache-control": "no-cache",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      })
    ).json();
    console.log(userObject, "userObject");

    linkedinDetails.push({
      tokenId: linkedinToken.id,
      accessToken: linkedinToken.accessToken,
      refreshToken: linkedinToken.refreshToken,
      profileId: linkedinToken.profileId,
      full_name:
        userObject.localizedFirstName + " " + userObject.localizedLastName,
    });
  }
  return linkedinDetails;
};

export const postToLinkedin = async (
  input: Omit<BasePostContentType, "files">,
) => {
  console.log(input, "postToLinkedin input");
  const tokenData = await db.query.linkedInToken
    .findFirst({
      where: eq(schema.linkedInToken.id, input.id),
    })
    .catch((error) => {
      console.log(error, "error");
      throw new Error("Error getting linkedin token");
    });
  console.log(tokenData, "tokenData postToLinkedin");
  if (!tokenData) {
    throw new Error("No linkedin token found");
  }
  const profileId = tokenData.profileId;
  const imageData = [] as LinkedInImage[];
  let data = {};
  if (!profileId) throw new Error("No profileId found for linkedin account");
  try {
    console.log(input.uploadedFiles, "input.uploadedFiles");
    const hasImages = input.uploadedFiles.some(
      (url) => getFileType(url) === "image",
    );
    if (input.uploadedFiles && input.uploadedFiles.length > 0) {
      for (const url of input.uploadedFiles) {
        console.log("for url", url);
        const data = await uploadMedia({
          authToken: tokenData.accessToken,
          fileUrl: url,
          isImage: hasImages,
          media: {
            owner: profileId,
          },
        });
        console.log(data, "data from uploadMedia");
        imageData.push({
          status: "READY",
          description: {
            text: "",
          },
          media: data,
          title: {
            text: "",
          },
        });
        console.log(imageData, "imageData");
      }
      data = {
        author: `urn:li:person:${profileId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: input.content,
            },
            shareMediaCategory: hasImages ? "IMAGE" : "VIDEO",
            media: imageData,
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };
    } else {
      data = {
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
    }

    await axios
      .post("https://api.linkedin.com/v2/ugcPosts", data, {
        headers: {
          "X-Restli-Protocol-Version": "2.0.0",
          Authorization: `Bearer ${tokenData.accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          return {
            success: true,
            message: "posted to linkedin",
            state: 200,
          };
        }
      })
      .finally(() => {
        console.log("Posted to LinkedIn");
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log("error", err);
  }
};

function getFileType(url: string): "image" | "video" | "unknown" {
  const extension = url.split(".").pop()?.toUpperCase();
  if (extension) {
    if (allowedImageTypes.includes(extension)) {
      return "image";
    }
    if (videoTypes.includes(extension)) {
      return "video";
    }
  }
  return "unknown";
}
interface LinkedInImage {
  status: string;
  description: {
    text: string;
  };
  media: string;
  title: {
    text: string;
  };
}
