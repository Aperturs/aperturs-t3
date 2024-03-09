import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { google } from "googleapis";
import { Readable } from "stream";
import https from "https";

function log(message: string) {
  console.log(message);
}

function errorLog(message: string) {
  console.error(message);
}

async function streamVideoFromS3(
  s3BucketName: string,
  s3Key: string,
  awsRegion: string
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
            `Received response from S3 with status code: ${response.statusCode}`
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
    process.env.CLIENT_SECRET
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
      `Error in getAccessToken function: ${JSON.stringify(error, null, 2)}`
    );
    throw error;
  }
}

async function uploadVideoToYoutube(
  videoStream: Readable,
  videoTitle: string,
  videoDescription: string,
  youtubeAccessToken: string
): Promise<any> {
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
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody,
      media,
    });
    log(
      `Video uploaded to YouTube successfully. Video ID: ${response.data.id}`
    );
    return response.data;
  } catch (error: any) {
    if (error.code === 401) {
      throw new Error("Invalid YouTube access token. Please refresh the token.");
    }
    errorLog(`Error in uploadVideoToYoutube function: ${error.message}`);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    log(`Starting video upload process.`);
    const s3BucketName = process.env.AWS_S3_BUCKET_NAME!;
    const s3Key = process.env.S3_VIDEO_KEY!;
    const awsRegion = process.env.AWS_REGION!;
    const videoTitle = process.env.VIDEO_TITLE!;
    const videoDescription = process.env.VIDEO_DESCRIPTION!;
    const youtubeRefreshToken = process.env.YOUTUBE_REFRESH_TOKEN!;

    if (
      !s3BucketName ||
      !s3Key ||
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

    const videoStream = await streamVideoFromS3(s3BucketName, s3Key, awsRegion);

    try {
      await uploadVideoToYoutube(
        videoStream,
        videoTitle,
        videoDescription,
        youtubeAccessToken
      );
    } catch (error: any) {
      if (error.message.includes("Invalid YouTube access token")) {
        log("Refreshing YouTube access token.");
        youtubeAccessToken = await getAccessToken(youtubeRefreshToken);
        await uploadVideoToYoutube(
          videoStream,
          videoTitle,
          videoDescription,
          youtubeAccessToken
        );
      } else {
        throw error;
      }
    }

    log(`Video upload process completed successfully.`);
  } catch (error: any) {
    errorLog(`Error in main function: ${error.message}`);
    process.exit(1);
  }
}

main();
