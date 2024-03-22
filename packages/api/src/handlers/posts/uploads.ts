import { s3Client } from "@api/utils/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "../../../env";

interface GetPresignedUrlInput {
  fileKey: string;
  fileType: string;
}

function cleanAWSKey(awsKey: string): string {
  // Remove spaces
  const cleanedKey = awsKey.replace(/\s/g, "");

  // Remove unwanted characters
  // cleanedKey = cleanedKey.replace(/[^A-Za-z0-9\-_]/g, '');

  return cleanedKey;
}

export async function GetPresignedUrl({
  fileKey,
  fileType,
}: GetPresignedUrlInput) {
  fileKey = cleanAWSKey(fileKey);
  const putParams = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });
  console.log("putParams", putParams);

  const uploadUrl = await getSignedUrl(s3Client, putParams, {
    expiresIn: 3600,
  }).catch((error) => {
    console.error("Error getting presigned URL", error);
    throw new Error("Error getting presigned URL");
  });
  return uploadUrl;
}
