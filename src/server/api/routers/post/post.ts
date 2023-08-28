import { TRPCError } from "@trpc/server";
import axios from "axios";
import https from "https";
import { z } from "zod";
import { SocialType } from "~/types/post-enums";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";

export const post = createTRPCRouter({
  postbyid: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.findUnique({
          where: {
            id: input.postId,
          },
        });

        if (post) {
          const content = post.content as unknown as PostContent[];
          const selectedSocials =
            post.socialSelected as unknown as SelectedSocial[];
          const defaultContent = post.defaultContent;
          for (const item of selectedSocials) {
            const PostContent =
              content.find((post) => post.id === item.id)?.content ||
              defaultContent;
            if (!item.id) continue;
            switch (item.type) {
              case `${SocialType.Twitter}`:
                //post to twitter
                console.log(PostContent);
                break;
              case `${SocialType.Linkedin}`:
                console.log(PostContent);
                //post to linkedin
                break;
              default:
                break;
            }
          }
          // if (!twitterError || !linkedinError) {
          //   reset();
          // }
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching post",
        });
      }
    }),
  schedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(`${input.date.getTime() - Date.now()}`, "delay");
      const headers = {
        Accept: "/",
        url: `https://2aa6-2a09-bac5-406c-101e-00-19b-5.ngrok-free.app/api/post/schedule?id=${input.id}&userId=${ctx.currentUser}`,
        delay: `30 seconds`,
        Authorization:
          "eyJVc2VySUQiOiI2MWViNWNiMy01MTFiLTQ5NDEtYWE4OS03MGRlMTkzNmY0NDciLCJQYXNzd29yZCI6IjY5OWNhZjRlMzVm",
      };

      const url = "https://52.66.162.116/v1/publish";

      await axios
        .post(
          url,
          {},
          {
            headers,
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
          }
        )
        .catch((error) => {
          console.error("Error:", error);
        });
    }),
});
