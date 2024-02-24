import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, schema } from "@aperturs/db";
import { SocialType } from "@aperturs/validators/post";

import { getGithubAccountDetails } from "../helpers/github";
import { getLinkedinAccountDetails } from "../helpers/linkedln";
import { getTwitterAccountDetails } from "../helpers/twitter";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
        details: z.object({}),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const user = await ctx.prisma.user.create({
      //   data: {
      //     clerkUserId: input.clerkId,
      //     userDetails: input.details,
      //   },
      // });
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

  getGithubAccounts: protectedProcedure.query(async ({ ctx }) => {
    const github = await ctx.db.query.githubToken.findMany({
      where: eq(schema.githubToken.clerkUserId, ctx.currentUser),
    });
    const githubDetails = await getGithubAccountDetails(github);
    return githubDetails;
  }),

  fetchConnectedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const twitter = await ctx.db.query.twitterToken.findMany({
      where: eq(schema.twitterToken.clerkUserId, ctx.currentUser),
    });
    const linkedin = await ctx.db.query.linkedInToken.findMany({
      where: eq(schema.linkedInToken.clerkUserId, ctx.currentUser),
    });
    const github = await ctx.db.query.githubToken.findMany({
      where: eq(schema.githubToken.clerkUserId, ctx.currentUser),
    });

    // TODO: define proper output types, instead of directly using Prisma types
    try {
      const accounts = [];
      const twitterDetails = await getTwitterAccountDetails(twitter);
      if (twitter.length > 0) {
        for (const twitterDetail of twitterDetails) {
          accounts.push({
            type: SocialType.Twitter,
            data: {
              tokenId: twitterDetail.tokenId,
              name: twitterDetail.full_name,
              profile_image_url: twitterDetail.profile_image_url,
              profileId: twitterDetail.profileId,
            },
          });
        }
      }
      const linkedinDetails = await getLinkedinAccountDetails(linkedin);

      if (linkedin.length > 0) {
        for (const linkedinDetail of linkedinDetails) {
          accounts.push({
            type: SocialType.Linkedin,
            data: {
              tokenId: linkedinDetail.tokenId,
              name: linkedinDetail.full_name,
              profile_image_url: linkedinDetail.profile_image_url,
              profileId: linkedinDetail.profileId,
            },
          });
        }
      }
      const githubDetails = await getGithubAccountDetails(github);
      if (github.length > 0) {
        for (const githubDetail of githubDetails) {
          accounts.push({
            type: SocialType.Github,
            data: {
              tokenId: githubDetail.tokenId,
              name: githubDetail.username,
              profile_image_url: githubDetail.profile_image_url,
              profileId: githubDetail.profileId,
            },
          });
        }
      }

      return accounts;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        message: "Error fetching connected accounts",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
