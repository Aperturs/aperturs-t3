import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TwitterApi } from "twitter-api-v2";

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
            clerkUserId: ctx.currentUser
        },
      });
      const {url,codeVerifier,state} = twitterClient.generateOAuth2AuthLink(
        "http://127.0.0.1:3000/settings/",
        {
          scope: ["users.read", "users.write","offline.access","tweets.read","tweets.write","dm.write","dm.read"],
        }
      );
      
      return {url}
    }),
});


