import { deleteFileFromAws, getFileDetails } from "@api/handlers/posts/uploads";
import {
  saveYoutubeContent,
  saveYoutubeContentSchema,
  updateYoutubeContent,
} from "@api/handlers/youtube/main";
import { limitDown, limitWrapper } from "@api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PostContentType } from "@aperturs/validators/post";
import { desc, eq, schema } from "@aperturs/db";
import {
  savePostInputSchema,
  updatePostInputSchema,
  updateYoutubePostSchema,
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
                organizationId: input.orgId ? input.orgId : undefined,
                clerkUserId: input.orgId ? undefined : ctx.currentUser,
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
      console.log(input, "input");
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

  getSavedPosts: protectedProcedure
    .input(
      z.object({
        orgid: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.orgid) {
        const posts = await ctx.db.query.post.findMany({
          where: eq(schema.post.organizationId, input.orgid),
          orderBy: desc(schema.post.updatedAt),
          with: {
            youtubeContent: true,
          },
        });
        return posts;
      } else {
        const posts = await ctx.db.query.post.findMany({
          where: eq(schema.post.clerkUserId, ctx.currentUser),
          orderBy: desc(schema.post.updatedAt),
          with: {
            youtubeContent: true,
          },
        });
        return posts;
      }
    }),

  getSavedPostById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.post.findFirst({
        where: eq(schema.post.id, input),
        with: {
          youtubeContent: true,
        },
      });
      const localPost = post?.content as PostContentType[];
      const contentWithEmptyFiles = localPost.map((post) => ({
        ...post,
        files: post.files ?? [],
      }));
      if (post?.postType === "NORMAL") {
        return {
          postType: post?.postType,
          scheduledAt: post?.scheduledAt,
          organizationId: post?.organizationId,
          content: contentWithEmptyFiles,
        };
      }
      if (post?.postType === "LONG_VIDEO") {
        if (!post.youtubeContent) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error youtube post",
          });
        }
        const video = await getFileDetails(post.youtubeContent.video);
        const thumbnail = await getFileDetails(post.youtubeContent.thumbnail);

        return {
          postType: post?.postType,
          ...post.youtubeContent,
          video,
          thumbnail,
          scheduledAt: post?.scheduledAt,
          organizationId: post?.organizationId,
          content: contentWithEmptyFiles,
        };
      }
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
      const res = await ctx.db.query.post.findFirst({
        where: eq(schema.post.id, input.id),
        with: {
          youtubeContent: true,
        },
      });
      try {
        await limitDown({
          func: () =>
            ctx.db.transaction(async (db) => {
              await db.delete(schema.post).where(eq(schema.post.id, input.id));
              if (res?.postType === "LONG_VIDEO") {
                await deleteFileFromAws([
                  res.youtubeContent.video,
                  res.youtubeContent.thumbnail,
                ]);
              }
            }),
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
    .input(
      saveYoutubeContentSchema.omit({
        userId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input, "input");
      const post = await saveYoutubeContent({
        ...input,
        userId: ctx.currentUser,
      });

      return {
        data: post,
        success: true,
        message: "Saved to draft successfully",
        state: 200,
      };
    }),
  updateYoutubePost: protectedProcedure
    .input(updateYoutubePostSchema)
    .mutation(async ({ input }) => {
      const post = await updateYoutubeContent(input);
      return {
        data: post,
        success: true,
        message: "Saved to draft successfully",
        state: 200,
      };
    }),
});
