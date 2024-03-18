import { post, schema } from "@aperturs/db";

import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const youtubePost = createTRPCRouter({
  saveYoutubePost: protectedProcedure
    .input(post.YoutubeContentInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const content = await ctx.db
        .insert(schema.youtubeContent)
        .values({ ...input, videoTags: input.videoTags as string[] })
        .returning();

      return content;
    }),
});
