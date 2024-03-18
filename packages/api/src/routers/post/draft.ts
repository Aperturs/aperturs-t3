import { limitDown, limitWrapper } from "@api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PostContentType } from "@aperturs/validators/post";
import { desc, eq, post, schema } from "@aperturs/db";
import {
  savePostInputSchema,
  updatePostInputSchema,
} from "@aperturs/validators/post";

export const posting = createTRPCRouter({
  savePost: protectedProcedure
    .input(savePostInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const savedPost = await limitWrapper(
          () =>
            ctx.db
              .insert(schema.post)
              .values({
                clerkUserId: ctx.currentUser,
                status: input.scheduledTime ? "SCHEDULED" : "SAVED",
                scheduledAt: input.scheduledTime
                  ? new Date(input.scheduledTime)
                  : null,
                content: input.postContent,
                projectId: input.projectId,
                updatedAt: new Date(),
              })
              .returning(),
          ctx.currentUser,
          "drafts",
        );

        const [post] = savedPost;

        if (!post) {
          throw new Error("Failed to save post");
        }

        return {
          data: post.id,
          success: true,
          message: "Saved to draft successfully",
          state: 200,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error saving to draft",
        });
      }
    }),

  getRecentDrafts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.post.findMany({
      where: eq(schema.post.clerkUserId, ctx.currentUser),
      orderBy: desc(schema.post.updatedAt),
      limit: 5,
    });
    return posts;
  }),

  updatePost: protectedProcedure
    .input(updatePostInputSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input.postContent);
      try {
        await ctx.db
          .update(schema.post)
          .set({
            status: input.scheduledTime ? "SCHEDULED" : "SAVED",
            scheduledAt: input.scheduledTime
              ? new Date(input.scheduledTime)
              : null,
            content: input.postContent,
            updatedAt: new Date(),
          })
          .where(eq(schema.post.id, input.postId));
        return {
          success: true,
          message: "Saved to draft successfully",
          state: 200,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error saving to draft",
        });
      }
    }),

  getSavedPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.query.post.findMany({
      where: eq(schema.post.clerkUserId, ctx.currentUser),
      orderBy: desc(schema.post.updatedAt),
    });
    return posts;
  }),

  getSavedPostById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // const post = await ctx.prisma.post.findUnique({
      //   where: { id: input },
      // });

      const post = await ctx.db.query.post.findFirst({
        where: eq(schema.post.id, input),
      });

      const localPost = post?.content as PostContentType[];
      const contentWithEmptyFiles = localPost.map((post) => ({
        ...post,
        files: post.files ?? [],
      }));

      return {
        scheduledAt: post?.scheduledAt,
        organizationId: post?.organizationId,
        content: contentWithEmptyFiles,
      };
    }),

  getSavedPostsByProjectId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const posts = await ctx.db.query.post.findMany({
          where: eq(schema.post.projectId, input),
          orderBy: desc(schema.post.updatedAt),
        });
        return posts;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching posts",
        });
      }
    }),

  deleteSavedPostById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await limitDown({
          func: () =>
            ctx.db.delete(schema.post).where(eq(schema.post.id, input.id)),
          clerkUserId: ctx.currentUser,
          limitType: "drafts",
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting post",
        });
      }
    }),
  saveYoutubePost: protectedProcedure
    .input(post.YoutubeContentInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const post = ctx.db.transaction(async (db) => {
        const postContent = await db
          .insert(schema.post)
          .values({
            content: {},
            status: "SAVED",
            updatedAt: new Date(),
            postType: "LONG_VIDEO",
          })
          .returning();
        if (!postContent[0]) {
          throw new Error("Failed to save post");
        }
        const content = await ctx.db
          .insert(schema.youtubeContent)
          .values({
            ...input,
            videoTags: input.videoTags as string[],
            postId: postContent[0].id,
          })
          .returning();
        return content;
      });

      return post;
    }),
});
