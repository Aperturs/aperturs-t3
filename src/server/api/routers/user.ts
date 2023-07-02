import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { env } from "~/env.mjs";
import { auth } from "twitter-api-sdk";

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
  addLinkedln: privateProcedure
    .input(
      z.object({
        profileImage: z.string(),
        vanityName: z.string(),
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
          profileImage: input.profileImage,
          vanityName: input.vanityName,
          profileId: input.profileId,
          access_token: input.access_token,
          refresh_token: input.refresh_token,
          expires_in: input.expires_in,
          refresh_token_expires_in: input.refresh_token_expires_in,
          user: { connect: { clerkUserId: ctx.clerkId } },
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

    if (twitter.length > 0) {
      for (const twitterAccount of twitter) {
        accounts.push({
          type: "twitter",
          data: {
            id: twitterAccount.id,
            username: twitterAccount.userName,
            name: twitterAccount.profileId,
            profileUrl: twitterAccount.profileImage,
          },
        });
      }
    }

    if (linkedin.length > 0) {
      for (const linkedinAccount of linkedin) {
        accounts.push({
          type: "linkedin",
          data: {
            id: linkedinAccount.id,
            username: linkedinAccount.vanityName,
            name: linkedinAccount.profileId,
            profileUrl: linkedinAccount.profileImage,
          },
        });
      }
    }
    return accounts;
  }),
});
