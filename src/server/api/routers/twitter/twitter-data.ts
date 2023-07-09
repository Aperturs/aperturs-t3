import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { getAccessToken } from "../../helpers";
import axios from "axios";
import { Client } from "twitter-api-sdk";



export const twitterData = createTRPCRouter({
  getAccessToken: protectedProcedure.input(z.object({
        tokenId: z.number(),})).query(async ({ ctx, input }) => {
     const token = await getAccessToken(input.tokenId);
     return { token }; 
    }),

  postSingleTweet: protectedProcedure.input(
    z.object({
      text: z.string(),
      id: z.number()
    })
  ).mutation(async ({ctx,input})=> {

    const accessToken = await getAccessToken(input.id)

    const client = new Client(accessToken)
    try{
      const post = await client.tweets.createTweet({
        text:'testing',
        poll:{
          duration_minutes:12,
          options: ['test1','test2']
        }
      })
      const reply = await client.tweets.createTweet({
        text:'thread',
        reply: {
          in_reply_to_tweet_id: post.data?.id || '12',
        }
       })
    }
    catch (error){
      console.log("error",error)
    }
      

  } )
});
