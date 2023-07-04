import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { getAccessToken } from "../../helpers";



export const twitterData = createTRPCRouter({
  getAccessToken: protectedProcedure.input(z.object({
        tokenId: z.number(),})).query(async ({ ctx, input }) => {
     const token = await getAccessToken(input.tokenId);
     return { token }; 
    }),
});
