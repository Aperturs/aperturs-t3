import {
  postToYoutube,
  saveYoutubeContent,
  updateYoutubeContent,
} from "@api/handlers/youtube/main";
import { z } from "zod";

import { updateYoutubePostSchema } from "@aperturs/validators/post";

import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const youtubePost = createTRPCRouter({
  postToYoutube: protectedProcedure
    .input(
      updateYoutubePostSchema.extend({
        shouldUpdate: z.boolean(),
        postId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let postId = "";

      if (input.shouldUpdate) {
        const postUpdate = await updateYoutubeContent(input);
        postId = postUpdate.id;
      } else {
        const postSave = await saveYoutubeContent({
          ...input,
          video: input.video ?? " ",
          thumbnail: input.thumbnail ?? " ",
          title: input.title ?? " ",
          videoTags: input.videoTags ?? [],
          description: input.description ?? " ",
          userId: ctx.currentUser,
          updatedAt: new Date(),
        });

        postId = postSave.id;
      }
      const post = await postToYoutube(postId);
      return post;
    }),
});
