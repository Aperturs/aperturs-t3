import axios from "axios";

import type {
  LinkedinMediaUploadResponse,
  MediaAsset,
} from "@aperturs/validators/linkedin";

export const getUploadFileUrl = async ({
  isImage,
  token,
  ownerUrn,
}: {
  isImage: boolean;
  token: string;
  ownerUrn: string;
}): Promise<LinkedinMediaUploadResponse> => {
  const res = await axios
    .post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          recipes: [
            `urn:li:digitalmediaRecipe:feedshare-${isImage ? "image" : "video"}`,
          ],
          owner: `urn:li:person:${ownerUrn}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          "X-Restli-Protocol-Version": "2.0.0",
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .catch((error) => {
      console.log(error, "error");
      throw new Error("Error getting image upload url");
    });
  const data = res.data as LinkedinMediaUploadResponse;
  return data;
};

export const uploadMedia = async ({
  authToken,
  media,
  fileUrl,
  isImage,
}: {
  authToken: string;
  media: MediaAsset;
  fileUrl: string;
  isImage: boolean;
}) => {
  const imageUploadUrl = await getUploadFileUrl({
    ownerUrn: media.owner,
    token: authToken,
    isImage: isImage,
  }).catch((error) => {
    console.log(error);
    throw new Error("Error getting image upload url");
  });
  console.log(imageUploadUrl, "upload");

  try {
    const fileResponse = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    });
    const res = await axios
      .put(
        imageUploadUrl.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl,
        fileResponse.data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/octet-stream",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        },
      )
      .catch((error) => {
        console.log(error, "error uploading image");
        throw new Error("Error uploading image");
      });

    console.log(res.data, "res.data");

    return imageUploadUrl.value.asset;
  } catch (error) {
    console.log("error from uploading");
    console.error(error);
    throw new Error("Error uploading" + fileUrl);
  }
};
