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
import { and, desc, eq, schema } from "@aperturs/db";
import {
  savePostInputSchema,
  SocialTypes,
  updatePostInputSchema,
  updateYoutubePostSchema,
} from "@aperturs/validators/post";

export const posting = createTRPCRouter({
  savePost: protectedProcedure
    .input(savePostInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const savedPost = await limitWrapper(
          () => {
            return ctx.db.transaction(async (tx) => {
              const post = await tx
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
                .returning();

              if (!post || post.length === 0) {
                throw new Error("Failed to save post");
              }
              if (post[0]?.id === undefined) {
                throw new Error("Failed to save post");
              }
              console.log(post, "post");
              for (const content of input.postContent) {
                if (typeof content.content === "string") {
                  console.log(content, "content");
                  await tx.insert(schema.singlePost).values({
                    content: content.content as string,
                    postId: post[0].id,
                    fileUrls: content.uploadedFiles,
                    name: content.name,
                    unique: content.unique,
                    socialType: content.socialType,
                    linkedInTokenId:
                      content.socialType === "LINKEDIN"
                        ? content.id
                        : undefined,
                    twitterTokenId:
                      content.socialType === "TWITTER" ? content.id : undefined,
                    updatedAt: new Date(),
                  });
                } else {
                  for (const subContent of content.content) {
                    await tx.insert(schema.singlePost).values({
                      content: subContent.content,
                      postId: post[0].id,
                      fileUrls: subContent.uploadedFiles,
                      name: subContent.name,
                      unique: subContent.unique,
                      socialType: subContent.socialType,
                      linkedInTokenId:
                        subContent.socialType === "LINKEDIN"
                          ? subContent.id
                          : undefined,
                      twitterTokenId:
                        subContent.socialType === "TWITTER"
                          ? subContent.id
                          : undefined,
                      parentSinglePostId: content.id,
                      updatedAt: new Date(),
                    });
                  }
                }
              }

              return post;
            });
          },
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

  getRecentDrafts: protectedProcedure
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
          limit: 5,
        });
        return posts;
      }
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
          where: and(
            eq(schema.post.organizationId, input.orgid),
            eq(schema.post.status, "SAVED"),
          ),
          orderBy: desc(schema.post.updatedAt),
          with: {
            youtubeContent: true,
          },
        });
        return posts;
      } else {
        const posts = await ctx.db.query.post.findMany({
          where: and(
            eq(schema.post.clerkUserId, ctx.currentUser),
            eq(schema.post.status, "SAVED"),
          ),
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
          singlesPosts: {
            with: {
              thread: true,
            },
          },
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching post",
        });
      }
      const localPost = post.singlesPosts.map((post) => ({
        content: post.thread.length > 0 ? post.thread : post.content,
        id: post.twitterTokenId ?? post.linkedInTokenId ?? SocialTypes.DEFAULT,
        name: post.name,
        unique: post.unique,
        socialType: post.socialType,
        uploadedFiles: post.fileUrls,
      })) as PostContentType[];
      // const localPost = post.content as PostContentType[];
      const contentWithEmptyFiles = localPost.map((post) => ({
        ...post,
        files: post.files ?? [],
      }));
      console.log(contentWithEmptyFiles, "post");
      if (post.postType === "NORMAL") {
        return {
          postType: post?.postType,
          scheduledAt: post?.scheduledAt,
          organizationId: post?.organizationId,
          content: contentWithEmptyFiles,
        };
      }
      if (post.postType === "LONG_VIDEO") {
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
