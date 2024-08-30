import { generateSocialMediaPost } from "@api/handlers/ai/linkedin";
import { makingPostsFrontendCompatible } from "@api/handlers/posts/draft";
import {
  GetPresignedUrl,
  scheduleLambdaEvent,
} from "@api/handlers/posts/uploads";
import { postToLinkedin } from "@api/helpers/linkedln";
import { postToTwitter } from "@api/helpers/twitter";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, schema } from "@aperturs/db";

import { env } from "../../../env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";

export const post = createTRPCRouter({
  postByPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log(input, "postby post id");
      let isError = false;
      let ErrorMessage = "";
      try {
        const post = await makingPostsFrontendCompatible({
          postId: input.postId,
        });

        const alternativeContent = post.post.alternativeContent.filter((item) =>
          post.socialProviders.some(
            (provider) => provider.socialId === item.socialProvider.socialId,
          ),
        );

        const unavailableSocialProviders = post.socialProviders.filter(
          (provider) =>
            !post.post.alternativeContent.some(
              (item) => item.socialProvider.socialId === provider.socialId,
            ),
        );

        for (const alterContent of alternativeContent) {
          if (alterContent.socialProvider.socialType === "TWITTER") {
            return await postToTwitter({
              tokenId: alterContent.socialProvider.socialId,
              tweets: alterContent.content,
            })
              .then(() => {
                console.log("Posted to Twitter");
              })
              .catch((error) => {
                console.error("Failed to post to Twitter", error);
                isError = true;
                if (error instanceof Error) {
                  ErrorMessage = error.message;
                } else {
                  ErrorMessage = "An unknown error occurred";
                }
                throw Error("Failed to post to Twitter");
              });
          }
          if (alterContent.socialProvider.socialType === "LINKEDIN") {
            return await postToLinkedin({
              socialId: alterContent.socialProvider.socialId,
              content: alterContent.content,
              postId: input.postId,
            }).catch((error) => {
              console.error("Failed to post to LinkedIn", error);
              isError = true;
              if (error instanceof Error) {
                ErrorMessage = error.message;
              } else {
                ErrorMessage = "An unknown error occurred";
              }
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to post to linkedin",
              });
            });
          }
        }

        for (const provider of unavailableSocialProviders) {
          if (provider.socialType === "TWITTER") {
            return await postToTwitter({
              tokenId: provider.socialId,
              tweets: post.post.content,
            })
              .then(() => {
                console.log("Posted to Twitter");
              })
              .catch((error) => {
                console.error("Failed to post to Twitter", error);
                isError = true;
                if (error instanceof Error) {
                  ErrorMessage = error.message;
                } else {
                  ErrorMessage = "An unknown error occurred";
                }
                throw Error("Failed to post to Twitter");
              });
          }
          if (provider.socialType === "LINKEDIN") {
            return await postToLinkedin({
              socialId: provider.socialId,
              content: post.post.content,
              postId: input.postId,
            }).catch((error) => {
              console.error("Failed to post to LinkedIn", error);
              isError = true;
              if (error instanceof Error) {
                ErrorMessage = error.message;
              } else {
                ErrorMessage = "An unknown error occurred";
              }
              throw Error("Failed to post to linkedin");
            });
          }
        }

        // if (post) {
        //   const promises = content.map(async (item) => {
        //     switch (item.socialType) {
        //       case `${"DEFAULT" as SocialType}`:
        //         return;
        //       case `${"TWITTER" as SocialType}`:
        //         return await postToTwitter({
        //           tokenId: item.id,
        //           tweets: item.content as BasePostContentType[],
        //         })
        //           .then(() => {
        //             console.log("Posted to Twitter");
        //           })
        //           .catch((error) => {
        //             console.error("Failed to post to Twitter", error);
        //             throw Error("Failed to post to Twitter");
        //           });

        //       case `${"LINKEDIN" as SocialType}`:
        //         console.log(item, "linkedin item");
        //         return await postToLinkedin({
        //           ...item,
        //           content: item.content as string,
        //         }).catch((error) => {
        //           console.error("Failed to post to LinkedIn", error);
        //           throw Error("Failed to post to linkedin");
        //         });

        //       default:
        //         return Promise.resolve(); // resolves immediately for unsupported types
        //     }
        //   });
        //   // Wait for all promises to resolve
        //   await Promise.all(promises).catch((e) => {
        //     throw new TRPCError({
        //       code: "INTERNAL_SERVER_ERROR",
        //       message: `something went wrong ${e.message}`,
        //     });
        //   });
        // }
        if (isError) {
          await ctx.db
            .update(schema.post)
            .set({
              postFailureReason: ErrorMessage,
            })
            .where(eq(schema.post.id, input.postId));
        }
        if (!post) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Post not found",
          });
        }

        if (!isError) {
          await ctx.db
            .update(schema.post)
            .set({
              status: "PUBLISHED",
            })
            .where(eq(schema.post.id, input.postId));
        }

        return {
          success: true,
          message: "succesully published",
          state: 200,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching post",
        });
      }
    }),

  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        filekey: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await GetPresignedUrl({
        fileKey: input.filekey,
        fileType: input.fileType,
      });
    }),

  schedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        console.log("Scheduling post", input);
        await scheduleLambdaEvent({
          time: input.date,
          url: `${env.DOMAIN}/api/post/scheduled?postid=${input.id}`,
          postid: input.id,
        });
        return {
          success: true,
          message: "Post scheduled successfully",
          state: 200,
        };
      } catch (err) {
        return {
          success: false,
          message: "Error scheduling post",
          state: 500,
        };
      }
    }),

  generate: protectedProcedure
    .input(
      z.object({
        idea: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await generateSocialMediaPost(input.idea);
    }),
});
