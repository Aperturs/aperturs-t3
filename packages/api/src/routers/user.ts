import { removeLinkedinDataFromDatabase } from "@api/handlers/linkedin/main";
import { removeTwitterDataFromDatabase } from "@api/handlers/twitter/main";
import { removeYoutubeDataFromDatabase } from "@api/handlers/youtube/main";
import { getAccounts } from "@api/helpers/get-socials";
import { z } from "zod";

import { createUniqueIds, eq, schema } from "@aperturs/db";
import { SocialTypeSchema } from "@aperturs/validators/post";
import { UniqueIdsSchema } from "@aperturs/validators/user";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getNanoId: protectedProcedure
    .input(
      z.object({
        id: UniqueIdsSchema,
        custom: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) => {
      return createUniqueIds(input.id, input.custom);
    }),
  createUser: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
        details: z.object({}),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .insert(schema.user)
        .values({
          clerkUserId: input.clerkId,
          userDetails: input.details,
          updatedAt: new Date(),
        })
        .returning();
      return user;
    }),

  // getGithubAccounts: protectedProcedure.query(async ({ ctx }) => {
  //   const github = await ctx.db.query.githubToken.findMany({
  //     where: eq(schema.githubToken.clerkUserId, ctx.currentUser),
  //   });
  //   const githubDetails = await getGithubAccountDetails(github);
  //   return githubDetails;
  // }),

  fetchConnectedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const socials = await ctx.db.query.socialProvider.findMany({
      where: eq(schema.socialProvider.clerkUserId, ctx.currentUser),
    });
    const accounts = getAccounts(socials);
    return accounts;
  }),

  removeSocialAccount: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
        socialType: SocialTypeSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.socialType === "TWITTER") {
        await removeTwitterDataFromDatabase({
          tokenId: input.tokenId,
          userId: ctx.currentUser,
        });
      } else if (input.socialType === "LINKEDIN") {
        await removeLinkedinDataFromDatabase({
          tokenId: input.tokenId,
          userId: ctx.currentUser,
        });
      } else if (input.socialType === "YOUTUBE") {
        await removeYoutubeDataFromDatabase({
          tokenId: input.tokenId,
          userId: ctx.currentUser,
        });
      }
    }),
});
