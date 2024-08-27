/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { uploadMedia } from "@api/handlers/linkedin/upload-media";
import { TRPCError } from "@trpc/server";
import axios from "axios";

import type { tokens } from "@aperturs/db";
import type { PostToLinkedInInput } from "@aperturs/validators/post";
import { db, eq, schema } from "@aperturs/db";
import { getValidMediaUrls } from "@aperturs/validators/post";

interface LinkedInTokenDetails
  extends Pick<
    tokens.SocialProviderSelectType,
    "accessToken" | "refreshToken" | "profileId"
  > {
  full_name: string;
  username?: string;
  profile_image_url?: string;
  tokenId: string;
}
export const getLinkedinAccountDetails = async (
  linkedinTokens: tokens.SocialProviderSelectType[],
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

export const postToLinkedin = async (input: PostToLinkedInInput) => {
  console.log(input, "postToLinkedin input");

  const content = input.content[0];

  if (!content) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No content found",
    });
  }
  const tokenData = await db.query.socialProvider
    .findFirst({
      where: eq(schema.socialProvider.id, input.socialId),
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
    const uploadedFiles = getValidMediaUrls(content.media);
    console.log(uploadedFiles, "input.uploadedFiles");
    const hasImage = uploadedFiles.some((file) => file.mediaType === "IMAGE");
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (!file.url) {
          continue;
        }
        const data = await uploadMedia({
          authToken: tokenData.accessToken,
          fileUrl: file.url,
          isImage: file.mediaType === "IMAGE",
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
              text: input.content[0]?.text ?? "",
            },
            shareMediaCategory: hasImage ? "IMAGE" : "VIDEO",
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
              text: input.content[0]?.text ?? "",
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
      .then(async (response) => {
        console.log(response.data, "response");

        if (response.status >= 200 && response.status < 300) {
          const urn = response.data.id as string;
          // Construct the LinkedIn post URL
          const postUrl = `https://www.linkedin.com/feed/update/${urn}`;
          console.log(postUrl, "postUrl");
          await db.insert(schema.platFormPost).values({
            platformPostUrl: postUrl,
            postId: input.postId,
            platformId: input.socialId,
            platformPostId: urn,
          });
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
      .catch(async (error) => {
        // console.error(error);
        if (error instanceof Error) {
          console.log(error.message, "error");
          const resason = error.message ?? "Error posting to LinkedIn";
          console.log(input.postId, "input.postId");
          await db
            .update(schema.post)
            .set({
              postFailureReason: resason,
            })
            .where(eq(schema.post.id, input.postId))
            .catch((error) => {
              console.log(error, "error upting post error message");
            });
        }
      });
  } catch (err) {
    console.log("error", err);
  }
};

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
