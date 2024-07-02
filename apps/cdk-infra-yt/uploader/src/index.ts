/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as https from "https";
import type { Readable } from "stream";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Redis } from "@upstash/redis";
import { google } from "googleapis";

function log(message: string) {
  console.log(message);
}

function errorLog(message: string) {
  console.error(message);
}

async function sendSuccessEmail(postid: string, videoUrl: string) {
  await fetch(
    `${process.env.DOMAIN!}/api/success/youtube-post?postid=${postid}&videoUrl=${videoUrl}`,
  );
}

async function streamVideoFromS3(
  s3BucketName: string,
  s3Key: string,
  awsRegion: string,
): Promise<Readable> {
  log(`Streaming video from S3: Bucket - ${s3BucketName}, Key - ${s3Key}`);
  const s3Client = new S3Client({
    region: awsRegion,
  });

  const getObjectParams = {
    Bucket: s3BucketName,
    Key: s3Key,
  };

  try {
    log(`Creating GetObjectCommand for S3 object.`);
    const command = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    log(`Signed URL obtained for S3 object: ${signedUrl}`);

    return new Promise((resolve, reject) => {
      log(`Initiating HTTPS request to stream video from S3.`);
      https
        .get(signedUrl, (response) => {
          log(
            `Received response from S3 with status code: ${response.statusCode}`,
          );
          if (response.statusCode !== 200) {
            const errorMessage = `Failed to get video stream from S3. Status Code: ${response.statusCode}`;
            errorLog(errorMessage);
            reject(new Error(errorMessage));
            return;
          }
          log(`Video stream from S3 obtained successfully.`);
          resolve(response);
        })
        .on("error", (error) => {
          errorLog(`Error while streaming video from S3: ${error.message}`);
          reject(error);
        });
    });
  } catch (error: any) {
    errorLog(`Error in streamVideoFromS3 function: ${error.message}`);
    throw error;
  }
}

async function getAccessToken(refreshToken: string): Promise<string> {
  log(`Obtaining YouTube access token.`);
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    const { token } = await oauth2Client.getAccessToken();
    if (!token) {
      throw new Error("Failed to obtain YouTube access token.");
    }
    log(`YouTube access token obtained successfully.`);
    return token;
  } catch (error: any) {
    errorLog(
      `Error in getAccessToken function: ${JSON.stringify(error, null, 2)}`,
    );
    throw error;
  }
}

async function uploadVideoToYoutube({
  videoStream,
  thumbnailStream,
  videoTitle,
  videoDescription,
  youtubeAccessToken,
  tags,
}: {
  videoStream: Readable;
  thumbnailStream: Readable;
  videoTitle: string;
  videoDescription: string;
  youtubeAccessToken: string;
  tags: string[];
}): Promise<string> {
  log(`Uploading video to YouTube: Title - ${videoTitle}`);

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: youtubeAccessToken,
  });
  const youtube = google.youtube({
    version: "v3",
    auth: auth,
  });

  const requestBody = {
    snippet: {
      title: videoTitle,
      description: videoDescription,
    },
    status: {
      privacyStatus: "public",
    },
  };

  const media = {
    mimeType: "video/*",
    body: videoStream,
  };

  try {
    const response = await youtube.videos
      .insert({
        part: ["snippet", "status"],
        requestBody: {
          ...requestBody,
          status: {
            madeForKids: false,
            privacyStatus: "private",
          },
          snippet: {
            ...requestBody.snippet,
            tags: tags,
          },
        },
        media,
      })
      .catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        log(error);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error(error);
      });
    log(
      `Video uploaded to YouTube successfully. Video ID: ${response.data.id}`,
    );

    if (!response.data.id) {
      throw new Error("Failed to get video ID from YouTube response.");
    }

    log(`Setting thumbnail for the uploaded video.`);

    const thumb = await youtube.thumbnails.set({
      videoId: response.data.id,
      access_token: youtubeAccessToken,
      media: {
        body: thumbnailStream,
      },
    });
    log(`${thumb.data.eventId}`);

    return response.data.id;
  } catch (error: any) {
    if (error.code === 401) {
      throw new Error(
        "Invalid YouTube access token. Please refresh the token.",
      );
    }
    errorLog(`Error in uploadVideoToYoutube function: ${error.message}`);
    throw error;
  }
}

interface FinalYoutubeContentType {
  name: string;
  thumbnail: string;
  videoUrl: string;
  videoTags: string[];
  videoTitle: string;
  videoDescription: string;
  awsRegion: string;
  s3BucketName: string;
  youtubeRefreshToken: string;
  email: string;
}

async function main(): Promise<void> {
  try {
    log(`Starting video upload process.`);

    const redis = new Redis({
      token: process.env.REDISTOKEN!,
      url: process.env.REDISURL!,
    });

    const rediskey = process.env.REDISPOSTKEY!;
    if (!rediskey) {
      throw new Error("Missing redis key in environment variables.");
    }

    const post = (await redis.get(rediskey)) as any as FinalYoutubeContentType;

    console.log(post);
    const s3BucketName = post.s3BucketName;
    const videoKey = post.videoUrl;
    const awsRegion = post.awsRegion;
    const videoTitle = post.videoTitle;
    const videoDescription = post.videoDescription;
    const youtubeRefreshToken = post.youtubeRefreshToken;
    const s3ThumbnailKey = post.thumbnail;
    const tags: string[] = post.videoTags;

    if (
      !s3BucketName ||
      !videoKey ||
      !awsRegion ||
      !videoTitle ||
      !videoDescription ||
      !youtubeRefreshToken
    ) {
      throw new Error("Missing required environment variables.");
    }

    let youtubeAccessToken: string;
    try {
      youtubeAccessToken = await getAccessToken(youtubeRefreshToken);
    } catch (error) {
      throw new Error("Failed to obtain YouTube access token.");
    }
    const videoStream = await streamVideoFromS3(
      s3BucketName,
      videoKey,
      awsRegion,
    );
    const thumbnailStream = await streamVideoFromS3(
      s3BucketName,
      s3ThumbnailKey,
      awsRegion,
    );

    let videoid = "";
    try {
      videoid = await uploadVideoToYoutube({
        videoStream,
        thumbnailStream,
        videoTitle,
        videoDescription,
        youtubeAccessToken,
        tags,
      });
    } catch (error: any) {
      if (error.message.includes("Invalid YouTube access token")) {
        log("Refreshing YouTube access token.");
        youtubeAccessToken = await getAccessToken(youtubeRefreshToken);
        videoid = await uploadVideoToYoutube({
          videoStream,
          thumbnailStream,
          videoTitle,
          videoDescription,
          youtubeAccessToken,
          tags,
        });
      } else {
        throw error;
      }
    }

    await sendSuccessEmail(rediskey, videoid);

    log(`Video upload process completed successfully.`);
  } catch (error: any) {
    errorLog(`Error in main function: ${error.message}`);
    process.exit(1);
  }
}

main();
