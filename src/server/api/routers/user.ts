import { z } from "zod";
import { createTRPCRouter, privateProcedure, protectedProcedure, publicProcedure } from "../trpc";
import { TwitterApi } from "twitter-api-v2";
import { prisma } from "~/server/db";
import { env } from "~/env.mjs";

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
        clientSecret:z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      
      const org = await ctx.prisma.twitterToken.create({
        data: {
            client_id: input.clientId,
            client_secret:input.clientSecret,
            clerkUserId: ctx.currentUser,
        },
      });
      const twitterClient = new TwitterApi({
        clientId: input.clientId,
        clientSecret: input.clientSecret,
      });

        const {url,codeVerifier,state} = twitterClient.generateOAuth2AuthLink(
        env.TWITTER_CALLBACK_URL,
        {
          scope: ["users.read", "users.write","offline.access"],
          state: org.id.toString(),
        }
      );
      if(codeVerifier){
      await ctx.prisma.twitterToken.update({
        where: {
          id: org.id,
        },
        data: {
          codeVerifier: codeVerifier,
        }
      })
    }
    console.log({
      state,
      callback: env.TWITTER_CALLBACK_URL,

    })
    return url;
    }),
    
    
});
