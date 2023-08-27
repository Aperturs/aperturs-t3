import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SocialType } from "~/types/post-enums";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const post = createTRPCRouter({
  postbyid: protectedProcedure
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
});
