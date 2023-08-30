import { z } from "zod";

export const savePostInputSchema = z.object({
  selectedSocials: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      name: z.string(),
    })
  ),
  postContent: z.array(
    z.object({
      id: z.string(),
      socialType: z.string(),
      content: z.string(),
    })
  ),
  defaultContent: z.string(),
  scheduledTime: z.date().optional(),
});

export type SavePostInput = z.infer<typeof savePostInputSchema>;

export const postTweetInputSchema = z.object({
  tokenId: z.string(),
  tweets: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
    })
  ),
});

export type PostTweetInput = z.infer<typeof postTweetInputSchema>;

export const postToLinkedInInputSchema = z.object({
  tokenId: z.string(),
  content: z.string(),
});

export type PostToLinkedInInput = z.infer<typeof postToLinkedInInputSchema>;
