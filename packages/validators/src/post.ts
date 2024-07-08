import { z } from "zod";

export const postType = {
  normal: "NORMAL",
  short: "SHORT",
  longVideo: "LONG_VIDEO",
} as const;

export const SocialTypes = {
  DEFAULT: "DEFAULT",
  TWITTER: "TWITTER",
  LINKEDIN: "LINKEDIN",
  LENS: "LENS",
  GITHUB: "GITHUB",
  YOUTUBE: "YOUTUBE",
  INSTAGRAM: "INSTAGRAM",
  FACEBOOK: "FACEBOOK",
} as const;

export type SocialType = (typeof SocialTypes)[keyof typeof SocialTypes];
export const SocialTypeSchema = z.enum([
  "DEFAULT",
  "TWITTER",
  "LINKEDIN",
  "LENS",
  "GITHUB",
  "YOUTUBE",
  "INSTAGRAM",
  "FACEBOOK",
] as const);

export type PostType = (typeof postType)[keyof typeof postType];
export const PostTypeSchema = z.nativeEnum(postType);

export const basePostSchema = z.object({
  id: z.string(),
  name: z.string(),
  socialType: z.string(),
  unique: z.boolean(),
  content: z.string(),
  files: z.array(z.instanceof(File)).default([]),
  previewUrls: z.array(z.string()).default([]).optional(),
  uploadedFiles: z.array(z.string()),
});

export type BasePostContentType = z.infer<typeof basePostSchema>;

export const videoTypes = [
  "MP4",
  "MOV",
  // "AVI",
  // "WMV",
  // "VC1",
  // "DVVIDEO",
  // "QTRLE",
  // "TSCC2",
  // "MPEG",
  // "MPEG2",
  "MKV",
  "WEBM",
];
export const allowedImageTypes = ["JPEG", "GIF", "PNG", "HEIC", "WEBP"];

export const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/heic",
  "image/webp",
]);

export const allowedVideoMimeTypes = new Set([
  "video/mp4",
  "video/quicktime", // For MOV
  "video/x-matroska", // For MKV
  "video/webm",
]);

// Define the complete schema including the recursive content field
export const postSchema = z.object({
  id: z.string(),
  name: z.string(),
  socialType: SocialTypeSchema,
  unique: z.boolean(),
  content: z.union([z.string(), z.array(basePostSchema)]),
  files: z.array(z.instanceof(File)).default([]),
  previewUrls: z.array(z.string()).default([]).optional(),
  uploadedFiles: z.array(z.string()),
});

export type PostContentType = z.infer<typeof postSchema>;

const youtubeContentSchema = z.object({
  youtubeId: z.string(),
  name: z.string(),
  thumbnail: z.string(),
  videoUrl: z.string(),
  videoTags: z.array(z.string()),
  videoTitle: z.string(),
  videoDescription: z.string(),
  thumbnailFile: z.instanceof(File).optional(),
  videoFile: z.instanceof(File).optional(),
});

export const finalYoutubeContentSchema = youtubeContentSchema
  .omit({
    thumbnailFile: true,
    videoFile: true,
    youtubeId: true,
  })
  .extend({
    awsRegion: z.string(),
    s3BucketName: z.string(),
    youtubeRefreshToken: z.string(),
  });

export type FinalYoutubeContentType = z.infer<typeof finalYoutubeContentSchema>;

export type youtubeContentType = z.infer<typeof youtubeContentSchema>;

export const savePostInputSchema = z.object({
  postContent: z.array(postSchema.omit({ files: true, previewUrls: true })),
  scheduledTime: z.date().optional(),
  projectId: z.string().optional(),
  orgId: z.string().optional(),
});

export const updatePostInputSchema = z.object({
  postContent: z.array(postSchema.omit({ files: true })),
  scheduledTime: z.date().optional(),
  postId: z.string(),
});

export const YoutubeContentType = z.object({
  id: z.string(),
  YoutubeTokenId: z.string(),
  postId: z.string(),
  videoTags: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  video: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  orgId: z.string().optional(),
});

export const updateYoutubePostSchema = YoutubeContentType.partial().extend({
  content: z.array(postSchema.omit({ files: true })),
});

export type UpdateYoutubePostInput = z.infer<typeof updateYoutubePostSchema>;

export type SavePostInput = z.infer<typeof savePostInputSchema>;

export const postTweetInputSchema = z.object({
  tokenId: z.string(),
  tweets: z.array(basePostSchema),
});

export type PostTweetInput = z.infer<typeof postTweetInputSchema>;

export const postToLinkedInInputSchema = z.object({
  tokenId: z.string(),
  content: z.string(),
  imageurl: z.string().optional(),
});

export type PostToLinkedInInput = z.infer<typeof postToLinkedInInputSchema>;

export function getFileType(url: string): "image" | "video" | "unknown" {
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

// might use these types later

// interface Tweet {
//   id: number;
//   text: string;
// }

// interface Thread {
//   threadId: 0;
//   thread: Tweet[];
// }
// interface IThreadVersions {
//   threadVersions: Thread[];
// }

// interface PostContent {
//   id: string;
//   name: string;
//   socialType: string;
//   content: string;
//   unique: boolean;
//   files: File[] | null;
// }
