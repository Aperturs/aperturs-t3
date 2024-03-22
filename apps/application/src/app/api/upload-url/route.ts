import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@clerk/nextjs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();
    const user = auth();
    const fileKey = `${fileName}`;

    const putParams = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    console.log("putParams", putParams);

    const uploadUrl = await getSignedUrl(s3Client, putParams).catch((error) => {
      console.error("Error getting presigned URL", error);
      throw new Error("Error getting presigned URL");
    });

    console.log(uploadUrl);

    return Response.json(
      { uploadUrl, fileKey },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return Response.json(
      { error: "Error generating upload URL" },
      { status: 500 },
    );
  }
}
