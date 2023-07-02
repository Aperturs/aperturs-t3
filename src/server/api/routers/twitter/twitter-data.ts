import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { TwitterApi } from "twitter-api-v2";
import { cookies } from 'next/headers'
import { env } from "~/env.mjs";


export const twitterOrgAuth = createTRPCRouter({
  fetchConnectedAccounts:protectedProcedure.query(
    async ({ ctx }) => {
      const accounts = await ctx.prisma.twitterToken.findMany({
        where:{
          clerkUserId: ctx.currentUser
        },
        select:{
          id:true,
          access_token:true,
          profileId:true,
          profileImage:true,
          userName:true,      
        }
      })
      return {accounts}
    }),
    getAccessToken: protectedProcedure.input(
      z.object({
        tokeenId: z.number(),
      })
    ).query(async ({ctx,input})=>{
      
      const token = await ctx.prisma.twitterToken.findUnique({
        where: {
          id: input.tokeenId,
      }
    })
    // check for expiration
    if(token){
      if(token.expires_in && token.refresh_token && token.access_token){
        if(token.expires_in < new Date()){
    const bearerToken = Buffer.from(
      `${token.client_id}:${token.client_secret}`
    ).toString("base64");

   const  response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${bearerToken}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    }),
  })
  const data = await response.json()
  await ctx.prisma.twitterToken.update({
    where:{
      id:input.tokeenId
    },
    data:{
      access_token:data.access_token,
      expires_in:new Date(new Date().getTime() + data.expires_in * 1000),
    }
  })
  return data.access_token
      }else{
        return token.access_token
      }
}
}
    })
});


