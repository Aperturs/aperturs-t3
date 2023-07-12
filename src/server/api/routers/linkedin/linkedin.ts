import { z } from "zod";
import {createTRPCRouter, protectedProcedure } from "../../trpc";
import axios from "axios";



export const linkedin = createTRPCRouter({

postToLinkedin: protectedProcedure.input(
   z.object({
    tokenid: z.number(),
    content: z.string(),
   })
  ).mutation(async ({ctx,input})=> {

    const accessToken = await ctx.prisma.linkedInToken.findUnique({
        where: {
            id: input.tokenid,
        },
        select:{
            access_token: true,
            profileId: true,
        }
    })
    console.log(accessToken?.access_token,"accessToken linkedin")
    const profileId = accessToken?.profileId
    try{
    const data = {
        author: `urn:li:person:${profileId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: input.content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };
      
      axios
        .post('https://api.linkedin.com/v2/ugcPosts', data, {
          headers: {
            'X-Restli-Protocol-Version': '2.0.0',
            Authorization: `Bearer ${accessToken?.access_token}`,
          },
        })
        .then((response) => {
          console.log(response.status);
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }catch(err){
        console.log("error",err)
    }

  })

})