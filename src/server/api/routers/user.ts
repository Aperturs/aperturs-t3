import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { auth } from "twitter-api-sdk";
import { getTwitterAccountDetails } from "../helpers/twitter";
import { getLinkedinAccountDetails } from "../helpers/linkedln";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          clerkUserId: input.clerkId,
        },
      });
      return user;
    }),
  addLinkedln: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
        access_token: z.string(),
        refresh_token: z.string().optional(),
        expires_in: z.date(),
        refresh_token_expires_in: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.linkedInToken.create({
        data: {
          profileId: input.profileId,
          access_token: input.access_token,
          refresh_token: input.refresh_token,
          expires_in: input.expires_in,
          refresh_token_expires_in: input.refresh_token_expires_in,
          user: { connect: { clerkUserId: ctx.currentUser } },
        },
      });
    }),

  addTwitter: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        clientSecret: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.prisma.twitterToken.create({
        data: {
          client_id: input.clientId,
          client_secret: input.clientSecret,
          clerkUserId: ctx.currentUser,
        },
      });
      const authClient = new auth.OAuth2User({
        client_id: input.clientId,
        client_secret: input.clientSecret,
        callback: env.TWITTER_CALLBACK_URL,
        scopes: ["users.read", "tweet.read", "offline.access"],
      });
      const url = authClient.generateAuthURL({
        state: org.id.toString(),
        code_challenge_method: "plain",
        code_challenge: "challenge",
      });

      return url;
    }),

  fetchConnectedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const twitter = await ctx.prisma.twitterToken.findMany({
      where: { clerkUserId: ctx.currentUser },
    });
    const linkedin = await ctx.prisma.linkedInToken.findMany({
      where: { clerkUserId: ctx.currentUser },
    });

    // TODO: define proper output types, instead of directly using Prisma types
    const accounts = [];
    const twitterDetails = await getTwitterAccountDetails(twitter);
    if (twitter.length > 0) {
      for (const twitterDetail of twitterDetails) {
        accounts.push({
          type: "twitter",
          data: {
            ...twitterDetail,
          },
        });
      }
    }
    const linkedinDetails = await getLinkedinAccountDetails(linkedin);

    if (linkedin.length > 0) {
      for (const linkedinDetail of linkedinDetails) {
        accounts.push({
          type: "linkedin",
          data: {
            ...linkedinDetail,
          },
        });
      }
    }
    return accounts;
  }),
});
