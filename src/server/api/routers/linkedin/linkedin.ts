import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const linkedin = createTRPCRouter({
  postToLinkedin: protectedProcedure
    .input(
      z.object({
        tokenId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tokenData = await ctx.prisma.linkedInToken.findUnique({
        where: {
          id: input.tokenId,
        },
        select: {
          access_token: true,
          profileId: true,
        },
      });
      console.log(tokenData?.access_token, "tokenData linkedin");
      const profileId = tokenData?.profileId;
      if (profileId) {
        try {
          const data = {
            author: `urn:li:person:${profileId}`,
            lifecycleState: "PUBLISHED",
            specificContent: {
              "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                  text: input.content,
                },
                shareMediaCategory: "NONE",
              },
            },
            visibility: {
              "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
            },
          };

          axios
            .post("https://api.linkedin.com/v2/ugcPosts", data, {
              headers: {
                "X-Restli-Protocol-Version": "2.0.0",
                Authorization: `Bearer ${tokenData?.access_token}`,
              },
            })
            .then((response) => {
              if (response.status === 200) {
                return {
                  success: true,
                  message: "posted to linkedin",
                  state: 200,
                };
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } catch (err) {
          console.log("error", err);
        }
      } else {
        console.log("no profile id");
      }
    }),
});
