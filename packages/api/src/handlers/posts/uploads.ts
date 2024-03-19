import { s3Client } from "@api/utils/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface GetPresignedUrlInput {
  fileKey: string;
  fileType: string;
}

export async function GetPresignedUrl({
  fileKey,
  fileType,
}: GetPresignedUrlInput) {
  const putParams = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });
  const uploadUrl = await getSignedUrl(s3Client, putParams);
  return uploadUrl;
}
