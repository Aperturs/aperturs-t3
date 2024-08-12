// import type { RunTaskCommandInput } from "@aws-sdk/client-ecs";
// import { limitDown, limitWrapper } from "@api/helpers/limitWrapper";
// import { googleAuth2Client } from "@api/index";
// import { ec2Client, ecsClient } from "@api/utils/aws";
// import {
//   DescribeSubnetsCommand,
//   DescribeVpcsCommand,
// } from "@aws-sdk/client-ec2";
// import { RunTaskCommand } from "@aws-sdk/client-ecs";
// import { z } from "zod";

// import type { tokens } from "@aperturs/db";
// import type {
//   FinalYoutubeContentType,
//   UpdateYoutubePostInput,
// } from "@aperturs/validators/post";
// import { db, eq, post, schema } from "@aperturs/db";
// import { redis } from "@aperturs/kv";
// import { postSchema } from "@aperturs/validators/post";

// import { env } from "../../../env";
// import { deleteFileFromAws } from "../posts/uploads";

// export const youtubeAuthUrl = () => {
//   const scopes = [
//     "https://www.googleapis.com/auth/youtube",
//     "https://www.googleapis.com/auth/youtube.upload",
//     "https://www.googleapis.com/auth/yt-analytics.readonly",
//     "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
//     "https://www.googleapis.com/auth/youtubepartner",
//   ];

//   const url = googleAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: scopes,
//     prompt: "consent",
//   });
//   return url;
// };

// export async function saveYoutubeDataToDatabase({
//   youtubeData,
//   userId,
// }: {
//   youtubeData: tokens.youtubeTokenInsert;
//   userId: string;
// }) {
//   await limitWrapper(
//     async () => await db.insert(schema.youtubeToken).values(youtubeData),
//     userId,
//     "socialaccounts",
//   );
// }

// export async function refreshYoutubeDataInDatabase({
//   tokenId,
//   youtubeData,
// }: {
//   tokenId: string;
//   youtubeData: tokens.youtubeTokenInsert;
// }) {
//   await db
//     .update(schema.youtubeToken)
//     .set(youtubeData)
//     .where(eq(schema.youtubeToken.id, tokenId));
// }

// export async function updateYoutubeContent(input: UpdateYoutubePostInput) {
//   const post = await db.transaction(async (db) => {
//     if (!input.postId) {
//       throw new Error("Post Id is required");
//     }
//     console.log("started");
//     const postContent = await db
//       .update(schema.post)
//       .set({
//         content: input.content,
//         updatedAt: new Date(),
//       })
//       .where(eq(schema.post.id, input.postId))
//       .returning();

//     if (!postContent[0]) {
//       throw new Error("Failed to save post");
//     }
//     console.log("postContent", postContent);
//     const postId = postContent[0].id;
//     if (input.video ?? input.thumbnail) {
//       const youtubeContent = await db.query.youtubeContent.findFirst({
//         where: eq(schema.youtubeContent.postId, postId),
//       });

//       if (youtubeContent && input.video) {
//         await deleteFileFromAws([youtubeContent.video]);
//       }
//       if (youtubeContent && input.thumbnail) {
//         await deleteFileFromAws([youtubeContent.thumbnail]);
//       }
//     }
//     const content = await db
//       .update(schema.youtubeContent)
//       .set({
//         description: input.description,
//         title: input.title,
//         video: input.video,
//         thumbnail: input.thumbnail,
//         postId: postId,
//         YoutubeTokenId: input.YoutubeTokenId ? input.YoutubeTokenId : null,
//         videoTags: input.videoTags ? input.videoTags : [],
//         updatedAt: new Date(),
//       })
//       .where(eq(schema.youtubeContent.postId, postId))
//       .returning();

//     console.log("content", content);

//     const contentRes = content[0];
//     const postRes = postContent[0];

//     return {
//       ...postRes,
//       content: contentRes,
//     };
//   });
//   return post;
// }

// export const saveYoutubeContentSchema = post.YoutubeContentInsertSchema.omit({
//   postId: true,
// }).extend({
//   content: z.array(postSchema.omit({ files: true })),
//   userId: z.string(),
//   orgId: z.string().optional(),
// });

// type saveYoutubeContentInput = z.infer<typeof saveYoutubeContentSchema>;

// export async function saveYoutubeContent(input: saveYoutubeContentInput) {
//   const post = await db.transaction(async (db) => {
//     const postContent = await db
//       .insert(schema.post)
//       .values({
//         organizationId: input.orgId ? input.orgId : undefined,
//         clerkUserId: !input.orgId ? input.userId : undefined,
//         content: input.content,
//         status: "SAVED",
//         updatedAt: new Date(),
//         postType: "LONG_VIDEO",
//       })
//       .returning();
//     if (!postContent[0]) {
//       throw new Error("Failed to save post");
//     }
//     const postId = postContent[0].id;
//     const content = await db
//       .insert(schema.youtubeContent)
//       .values({
//         description: input.description,
//         title: input.title,
//         video: input.video,
//         thumbnail: input.thumbnail,
//         updatedAt: new Date(),
//         YoutubeTokenId: input.YoutubeTokenId,
//         videoTags: input.videoTags as string[],
//         postId: postId,
//       })
//       .returning();

//     const contentRes = content[0];
//     const postRes = postContent[0];

//     return {
//       ...postRes,
//       content: contentRes,
//     };
//   });

//   return post;
// }

// export async function postToYoutube(postId: string) {
//   const { Vpcs } = await ec2Client.send(
//     new DescribeVpcsCommand({
//       Filters: [{ Name: "isDefault", Values: ["true"] }],
//     }),
//   );

//   const defaultVpcId = Vpcs?.[0]?.VpcId ?? null;

//   const { Subnets } = await ec2Client.send(
//     new DescribeSubnetsCommand({
//       Filters: [{ Name: "vpc-id", Values: [defaultVpcId ?? ""] }],
//     }),
//   );

//   const subnetIds = Subnets?.map((subnet) => subnet.SubnetId).filter(
//     Boolean,
//   ) as string[];

//   const post = await db.query.post.findFirst({
//     where: eq(schema.post.id, postId),
//     with: {
//       youtubeContent: true,
//     },
//   });

//   if (!post?.youtubeContent) {
//     throw new Error("Youtube content not found");
//   }

//   if (!post.youtubeContent.YoutubeTokenId) {
//     throw new Error("Youtube token not found");
//   }

//   const token = await db.query.youtubeToken.findFirst({
//     where: eq(schema.youtubeToken.id, post.youtubeContent.YoutubeTokenId),
//   });

//   if (!token) {
//     throw new Error("Youtube token not found");
//   }

//   const finalPostData = {
//     awsRegion: env.AWS_REGION,
//     name: "test",
//     s3BucketName: env.AWS_S3_BUCKET_NAME,
//     thumbnail: post.youtubeContent.thumbnail,
//     videoDescription: post.youtubeContent.description,
//     videoTags: post.youtubeContent.videoTags,
//     videoTitle: post.youtubeContent.title,
//     videoUrl: post.youtubeContent.video,
//     youtubeRefreshToken: token.refreshToken,
//   } as FinalYoutubeContentType;

//   await redis.set(post.id, finalPostData);

//   const params: RunTaskCommandInput = {
//     cluster: env.ECS_CLUSTER_NAME,
//     taskDefinition: env.ECS_TASK_DEFINITION_ARN,
//     launchType: "FARGATE",
//     count: 1,
//     networkConfiguration: {
//       awsvpcConfiguration: {
//         subnets: subnetIds,
//         assignPublicIp: "ENABLED",
//         securityGroups: [env.ECS_SECURITY_GROUP_ID],
//       },
//     },
//     overrides: {
//       containerOverrides: [
//         {
//           name: env.ECS_CONTAINER_NAME,
//           environment: [
//             {
//               name: "REDISURL",
//               value: env.REDISURL,
//             },
//             {
//               name: "DOMAIN",
//               value: env.DOMAIN,
//             },
//             {
//               name: "REDISTOKEN",
//               value: env.REDISTOKEN,
//             },
//             {
//               name: "REDISPOSTKEY",
//               value: post.id,
//             },
//             {
//               name: "CLIENT_ID",
//               value: env.GOOGLE_CLIENT_ID,
//             },
//             {
//               name: "CLIENT_SECRET",
//               value: env.GOOGLE_CLIENT_SECRET,
//             },
//           ],
//         },
//       ],
//     },
//   };

//   const command = new RunTaskCommand(params);

//   try {
//     const response = await ecsClient.send(command);
//     console.log(
//       "Task started:",
//       response.tasks?.[0]?.taskArn ?? "No task ARN found",
//     );
//   } catch (error) {
//     console.error("Error running task:", error);
//   }
// }

// export async function removeYoutubeDataFromDatabase({
//   tokenId,
//   userId,
// }: {
//   tokenId: string;
//   userId: string;
// }) {
//   await limitDown({
//     func: async () =>
//       await db
//         .delete(schema.youtubeToken)
//         .where(eq(schema.youtubeToken.id, tokenId)),
//     clerkUserId: userId,
//     limitType: "socialaccounts",
//   });
// }
