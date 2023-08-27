import { TRPCError } from "@trpc/server";
import axios from "axios";
import https from "https";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";



export const posting = createTRPCRouter({
  savePost: protectedProcedure
    .input(
      z.object({
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
      })
    )
    .mutation(async ({ ctx, input }) => {
 
      try {
        await ctx.prisma.post.create({
          data: {
            clerkUserId: ctx.currentUser,
            status: input.scheduledTime ? "SCHEDULED" : "SAVED",
            scheduledAt: input.scheduledTime
              ? new Date(input.scheduledTime)
              : null,
            defaultContent: input.defaultContent,
            content: input.postContent,
            socialSelected: input.selectedSocials,
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

  updatePost: protectedProcedure.input(z.object({
    postId: z.string(),
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
  })).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.post.update({
        where: { id: input.postId },
        data: {
          status: input.scheduledTime ? "SCHEDULED" : "SAVED",
          scheduledAt: input.scheduledTime ? new Date(input.scheduledTime) : null,
          defaultContent: input.defaultContent,
          content: input.postContent,
          socialSelected: input.selectedSocials,
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
      return post;
    }),

  deleteSavedPostById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.delete({
          where: { id: input.id },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting post",
        });
      }
    }),

  

  test: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx }) => {
      const headers = {
        Accept: "/",
        url: `https://52.66.162.116/ping`,
        delay: "one minute",
        Authorization:
          "eyJVc2VySUQiOiI2MWViNWNiMy01MTFiLTQ5NDEtYWE4OS03MGRlMTkzNmY0NDciLCJQYXNzd29yZCI6IjY5OWNhZjRlMzVm",
      };

      const url = "https://52.66.162.116/v1/publish";

      await axios
        .post(
          url,
          {},
          {
            headers,
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
          }
        )
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }),
  hello: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      console.log("this is hit");
      return input.id;
    }),
});
