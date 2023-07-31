import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { auth } from "twitter-api-sdk";
import { getTwitterAccountDetails } from "../helpers/twitter";
import { getLinkedinAccountDetails } from "../helpers/linkedln";
import { ConnectSocial } from "../helpers/misc";
import { TRPCError } from "@trpc/server";
import { SocialType } from "~/types/post-enums";

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
      }else{
        throw new TRPCError({message:"Upgrade to higher plan to connect more Socials",code:"FORBIDDEN"})
      }
    }
    ),

  addGithub: protectedProcedure
    .input(
      z.object({
        access_token: z.string(),
        profileId: z.string(),
        expires_in: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.githubToken.create({
        data: {
          user: { connect: { clerkUserId: ctx.currentUser } },
          access_token: input.access_token,
          expires_in: input.expires_in,
          profileId: input.profileId,
        },
      });
    }),

  

  fetchConnectedAccounts: protectedProcedure.query(async ({ ctx }) => {
    const twitter = await ctx.prisma.twitterToken.findMany({
      where: { clerkUserId: ctx.currentUser },
    });
    const linkedin = await ctx.prisma.linkedInToken.findMany({
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

      return accounts;
    } catch (error) {
      console.log(error);
    }
  }),

});
