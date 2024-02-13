import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  savePostInputSchema,
  updatePostInputSchema,
  type PostContentType,
} from "~/types/post-types";
import { limitDown, limitWrapper } from "~/server/api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const posting = createTRPCRouter({
  savePost: protectedProcedure
    .input(savePostInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const savedPost = await limitWrapper(
          () =>
            ctx.prisma.post.create({
              data: {
                clerkUserId: ctx.currentUser,
                status: input.scheduledTime ? "SCHEDULED" : "SAVED",
                scheduledAt: input.scheduledTime
                  ? new Date(input.scheduledTime)
                  : null,
                content: input.postContent,
                projectId: input.projectId,
              },
            }),
          ctx.currentUser,
          "drafts",
        );
        return {
          data: savedPost.id,
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
    const posts = await ctx.prisma.post.findMany({
      where: { clerkUserId: ctx.currentUser, status: "SAVED" },
      orderBy: [{ updatedAt: "desc" }],
      take: 5,
    });
    return posts;
  }),

  updatePost: protectedProcedure
    .input(updatePostInputSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input.postContent);
      try {
        await ctx.prisma.post.update({
          where: { id: input.postId },
          data: {
            status: input.scheduledTime ? "SCHEDULED" : "SAVED",
            scheduledAt: input.scheduledTime
              ? new Date(input.scheduledTime)
              : null,
            content: input.postContent,
          },
        });

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
    const posts = await ctx.prisma.post.findMany({
      where: { clerkUserId: ctx.currentUser, status: "SAVED" },
      orderBy: [{ updatedAt: "desc" }],
    });
    return posts;
  }),

  getSavedPostById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input },
      });

      const localPost = post?.content as unknown as PostContentType[];
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
        const posts = await ctx.prisma.post.findMany({
          where: { projectId: input, status: "SAVED" },
          orderBy: [{ updatedAt: "desc" }],
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
        await limitDown(
          () =>
            ctx.prisma.post.delete({
              where: { id: input.id },
            }),
          ctx.currentUser,
          "drafts",
        );
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting post",
        });
      }
    }),
});
