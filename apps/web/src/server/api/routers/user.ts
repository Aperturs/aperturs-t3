import { TRPCError } from "@trpc/server";
import { auth } from "twitter-api-sdk";
import { z } from "zod";
import { env } from "~/env.mjs";
import { SocialType } from "~/types/post-enums";
import { getGithubAccountDetails } from "../helpers/github";
import { getLinkedinAccountDetails } from "../helpers/linkedln";
import { ConnectSocial } from "../helpers/misc";
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
      const user = await ctx.prisma.user.create({
        data: {
          clerkUserId: input.clerkId,
          userDetails: input.details,
        },
      });
      return user;
    }),

  addLinkedln: protectedProcedure.mutation(async ({ ctx }) => {
    const canConnect = await ConnectSocial({ user: ctx.currentUser });
    console.log(canConnect, "canConnect");
    if (canConnect) {
      const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${env.NEXT_PUBLIC_LINKEDIN_CALLBACK_URL}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
      return { url };
    }
    throw new TRPCError({
      message: "Upgrade to higher plan to connect more Socials",
      code: "FORBIDDEN",
    });
  }),

  addGithub: protectedProcedure.mutation(() => {
    // const canConnect = await ConnectSocial({ user: ctx.currentUser });

    // if (canConnect) {
    try {
      const url = `https://github.com/login/oauth/authorize?client_id=${
        env.NEXT_PUBLIC_GITHUB_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        env.NEXT_PUBLIC_GITHUB_CALLBACK_URL,
      )}&scope=${encodeURIComponent("user repo")}`;
      return { url };
    } catch (error) {
      console.log(error);
    }
  }),

  addTwitter: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        clientSecret: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const canConnect = await ConnectSocial({ user: ctx.currentUser });
      if (canConnect) {
        const authClient = new auth.OAuth2User({
          client_id: input.clientId,
          client_secret: input.clientSecret,
          callback: env.TWITTER_CALLBACK_URL,
          scopes: [
            "users.read",
            "tweet.read",
            "offline.access",
            "tweet.write",
            "follows.read",
            "follows.write",
            "like.write",
            "list.read",
            "list.write",
            "bookmark.read",
            "bookmark.write",
          ],
        });
        const url = authClient.generateAuthURL({
          state: `${input.clientId}-${input.clientSecret}`,
          // state: org.id.toString(),
          code_challenge_method: "plain",
          code_challenge: "challenge",
        });

        return url;
      } else {
        throw new TRPCError({
          message: "Upgrade to higher plan to connect more Socials",
          code: "FORBIDDEN",
        });
      }
    }),

  getGithubAccounts: protectedProcedure.query(async ({ ctx }) => {
    const github = await ctx.prisma.githubToken.findMany({
      where: { clerkUserId: ctx.currentUser },
    });
    const githubDetails = await getGithubAccountDetails(github);
    return githubDetails;
  }),

  fetchConnectedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const twitter = await ctx.prisma.twitterToken.findMany({
      where: { clerkUserId: ctx.currentUser },
    });
    const linkedin = await ctx.prisma.linkedInToken.findMany({
      where: { clerkUserId: ctx.currentUser },
    });

    const github = await ctx.prisma.githubToken.findMany({
      where: { clerkUserId: ctx.currentUser },
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
