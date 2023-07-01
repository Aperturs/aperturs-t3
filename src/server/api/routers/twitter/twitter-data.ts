import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TwitterApi } from "twitter-api-v2";
import { cookies } from 'next/headers'
import { env } from "~/env.mjs";


export const twitterOrgAuth = createTRPCRouter({
  connectTwitterOrg: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        clientSecret:z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const twitterClient = new TwitterApi({
        clientId: input.clientId,
        clientSecret: input.clientSecret,
      });

      
      const org = await ctx.prisma.twitterToken.create({
        data: {
            client_id: input.clientId,
            client_secret:input.clientSecret,
            clerkUserId: ctx.currentUser,
        },
      });

      const {url,codeVerifier,state} = twitterClient.generateOAuth2AuthLink(
        env.TWITTER_CALLBACK_URL,
        {
          scope: ["users.read", "users.write","offline.access","tweets.read","tweets.write","dm.write","dm.read"],
          state: org.id.toString(),
        }
      );

       
    },),
});


