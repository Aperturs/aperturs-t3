import { s3Client, scheduler } from "@api/utils/aws";
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { CreateScheduleCommandInput } from "@aws-sdk/client-scheduler";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "../../../env";

interface GetPresignedUrlInput {
  fileKey: string;
  fileType: string;
}

interface FileItem {
  fileKey: string;
  url: string;
  fileName: string;
  fileSize: string;
  isSelected: boolean;
  createdAt: Date;
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
  console.log(uploadUrl);
  return { uploadUrl, fileKey };
}

export async function getFileDetails(fileKey: string) {
  const headObjectParams = {
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };
  console.log("headObjectParams", headObjectParams);

  const headObjectCommand = new HeadObjectCommand(headObjectParams);
  const headObjectOutput = await s3Client
    .send(headObjectCommand)
    .catch((error) => {
      console.error("Error getting file details", error);
      throw new Error("Error getting file details");
    });

  console.log("headObjectOutput", headObjectOutput);

  const getObjectParams = {
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };
  const getObjectCommand = new GetObjectCommand(getObjectParams);
  console.log("getObjectCommand", getObjectCommand);
  const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: 3600, // URL expires in 1 hour
  });
  console.log(signedUrl);

  const fileDetails: FileItem = {
    fileKey: fileKey,
    fileName: fileKey.split("/").pop()!,
    fileSize: `${(headObjectOutput.ContentLength! / 1024).toFixed(2)} KB`,
    url: signedUrl,
    createdAt: headObjectOutput.LastModified!,
    isSelected: false,
  };

  return fileDetails;
}

export async function deleteFileFromAws(fileKeys: string[]) {
  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Delete: {
      Objects: fileKeys.map((key: string) => ({ Key: key })),
    },
  };
  console.log("deleteParams", deleteParams);
  try {
    await s3Client.send(new DeleteObjectsCommand(deleteParams));
    console.log("Files deleted successfully");
    return Response.json(
      { message: "Files deleted successfully" },
      { status: 200 },
    );
  } catch {
    return Response.json({ message: "Error deleting files" }, { status: 500 });
  }
}

function formatUTCDate(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // JavaScript months are zero-indexed
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export async function scheduleLambdaEvent({
  time,
  url,
  postid,
}: {
  time: Date;
  url: string;
  postid: string;
}) {
  const eventDetail = {
    detail: {
      url: url, // URL to be requested by the Lambda function
    },
  };

  console.log("Scheduling event for:", formatUTCDate(time), time);
  console.log("Event detail:", eventDetail);

  const schedularInput = {
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    ActionAfterCompletion: "DELETE",
    Target: {
      Arn: "arn",
      RoleArn: "arn",
      Input: JSON.stringify(eventDetail),
    },
    ScheduleExpression: `at(${formatUTCDate(time)})`,
    ScheduleExpressionTimezone: "UTC",
    Name: `scheduleforpost${postid.replaceAll(":", "").replaceAll(".", "")}`,
  } as CreateScheduleCommandInput;

  try {
    const res = await scheduler.createSchedule(schedularInput);
    return res;
  } catch (error) {
    console.error("Failed to schedule event:", error);
    throw error;
  }
}
