import {
  makingPostsFrontendCompatible,
  saveDraftToDatabase,
  updateDraftToDatabase,
} from "@api/handlers/posts/draft";
import {
  saveYoutubeContent,
  saveYoutubeContentSchema,
  updateYoutubeContent,
} from "@api/handlers/youtube/main";
import { limitDown, limitWrapper } from "@api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq, schema } from "@aperturs/db";
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
        const post = await limitWrapper(
          () => {
            return saveDraftToDatabase({
              ...input,
              userId: ctx.currentUser,
            });
          },
          ctx.currentUser,
          "drafts",
        );
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
        await updateDraftToDatabase({
          ...input,
          userId: ctx.currentUser,
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
            socialProviders: true,
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
            socialProviders: true,
          },
        });
        return posts;
      }
    }),

  getSavedPostById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const post = makingPostsFrontendCompatible({
        postId: input,
      });
      return post;
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
            ctx.db.transaction(async (db) => {
              await db
                .update(schema.post)
                .set({
                  isDeleted: true,
                  status: "DELETED",
                })
                .where(eq(schema.post.id, input.id));
              // if (res?.postType === "LONG_VIDEO") {
              //   await deleteFileFromAws([
              //     res.youtubeContent.video,
              //     res.youtubeContent.thumbnail,
              //   ]);
              // }
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
