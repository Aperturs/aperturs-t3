import { deleteFileFromAws, getFileDetails } from "@api/handlers/posts/uploads";
import { limitDown, limitWrapper } from "@api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { PostContentType } from "@aperturs/validators/post";
import { desc, eq, post, schema } from "@aperturs/db";
import {
  postSchema,
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
      with: {
        youtubeContent: true,
      },
    });
    return posts;
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
      post.YoutubeContentInsertSchema.omit({ postId: true }).extend({
        content: z.array(postSchema.omit({ files: true })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.transaction(async (db) => {
        const postContent = await db
          .insert(schema.post)
          .values({
            clerkUserId: ctx.currentUser,
            content: input.content,
            status: "SAVED",
            updatedAt: new Date(),
            postType: "LONG_VIDEO",
          })
          .returning();
        if (!postContent[0]) {
          throw new Error("Failed to save post");
        }
        const postId = postContent[0].id;
        console.log(postId, "postId");
        const content = await db
          .insert(schema.youtubeContent)
          .values({
            ...input,
            videoTags: input.videoTags as string[],
            postId: postId,
          })
          .returning();

        const contentRes = content[0];
        const postRes = postContent[0];

        return {
          ...postRes,
          content: contentRes,
        };
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
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const post = await ctx.db.transaction(async (db) => {
        if (!input.postId) {
          throw new Error("Post Id is required");
        }
        console.log("started");
        const postContent = await db
          .update(schema.post)
          .set({
            content: input.content,
            updatedAt: new Date(),
          })
          .where(eq(schema.post.id, input.postId))
          .returning();

        if (!postContent[0]) {
          throw new Error("Failed to save post");
        }
        console.log("postContent", postContent);
        const postId = postContent[0].id;
        if (input.video ?? input.thumbnail) {
          const youtubeContent = await db.query.youtubeContent.findFirst({
            where: eq(schema.youtubeContent.postId, postId),
          });

          if (youtubeContent && input.video) {
            await deleteFileFromAws([youtubeContent.video]);
          }
          if (youtubeContent && input.thumbnail) {
            await deleteFileFromAws([youtubeContent.thumbnail]);
          }
        }
        const content = await db
          .update(schema.youtubeContent)
          .set({
            description: input.description,
            title: input.title,
            video: input.video,
            thumbnail: input.thumbnail,
            postId: postId,
            YoutubeTokenId: input.YoutubeTokenId ? input.YoutubeTokenId : null,
            videoTags: input.videoTags ? input.videoTags : [],
            updatedAt: new Date(),
          })
          .where(eq(schema.youtubeContent.postId, postId))
          .returning();

        console.log("content", content);

        const contentRes = content[0];
        const postRes = postContent[0];

        return {
          ...postRes,
          content: contentRes,
        };
      });

      return {
        data: post,
        success: true,
        message: "Saved to draft successfully",
        state: 200,
      };
    }),
});
