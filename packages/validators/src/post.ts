import { z } from "zod";

const postSchema = z.object({
  id: z.string(),
  name: z.string(),
  socialType: z.string(),
  content: z.string(),
  unique: z.boolean(),
  files: z.array(z.instanceof(File)).default([]),
  uploadedFiles: z.array(z.string()),
});

export type PostContentType = z.infer<typeof postSchema>;

export const savePostInputSchema = z.object({
  postContent: z.array(postSchema.omit({ files: true })),
  scheduledTime: z.date().optional(),
  projectId: z.string().optional(),
});

export const updatePostInputSchema = z.object({
  postContent: z.array(postSchema.omit({ files: true })),
  scheduledTime: z.date().optional(),
  postId: z.string(),
});

export type SavePostInput = z.infer<typeof savePostInputSchema>;

export const postTweetInputSchema = z.object({
  tokenId: z.string(),
  tweets: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
    }),
  ),
});

export type PostTweetInput = z.infer<typeof postTweetInputSchema>;

export const postToLinkedInInputSchema = z.object({
  tokenId: z.string(),
  content: z.string(),
});

export type PostToLinkedInInput = z.infer<typeof postToLinkedInInputSchema>;

export enum SocialType {
  Default = "DEFAULT",
  Twitter = "TWITTER",
  Linkedin = "LINKEDIN",
  Lens = "LENS",
  Github = "Github",
  Youtube = "YOUTUBE",
}

export const SocialTypeSchema = z.nativeEnum(SocialType);

export const postType = {
  normal: "NORMAL",
  short: "SHORT",
  longVideo: "LONG_VIDEO",
} as const;

export type PostType = (typeof postType)[keyof typeof postType];
export const PostTypeSchema = z.nativeEnum(postType);

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
