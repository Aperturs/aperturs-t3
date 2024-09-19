import { removeLinkedinDataFromDatabase } from "@api/handlers/linkedin/main";
import { removeTwitterDataFromDatabase } from "@api/handlers/twitter/main";
import { getAccounts } from "@api/helpers/get-socials";
import { z } from "zod";

import type { PersonalPreferenceType } from "@aperturs/validators/personalization";
import { createUniqueIds, eq, schema } from "@aperturs/db";
import { personalPreferenceSchema } from "@aperturs/validators/personalization";
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

  addPreferences: protectedProcedure
    .input(personalPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(schema.user)
        .set({
          personalization: input,
        })
        .where(eq(schema.user.clerkUserId, ctx.currentUser))
        .catch((e) => {
          console.error(e);
          throw Error("Failed to add preferences");
        });

      return {
        success: true,
        status: "Preferences added successfully",
      };
    }),

  fetchUserPreferences: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.user.findFirst({
      where: eq(schema.user.clerkUserId, ctx.currentUser),
    });
    return user?.personalization as PersonalPreferenceType | null;
  }),

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
        // await removeYoutubeDataFromDatabase({
        //   tokenId: input.tokenId,
        //   userId: ctx.currentUser,
        // });
      }
    }),
});
