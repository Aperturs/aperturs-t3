import {
  extractYoutubeFromUrl,
  generateLinkedinPostBasedOnLongText,
  generateLinkedinPostBasedOnTopic,
  generatePostDirectly,
  getMarkdownFromArticle,
  summarizeText,
} from "@api/handlers/ai/linkedin";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { z } from "zod";

import type { PersonalPreferenceType } from "@aperturs/validators/personalization";
import { eq, schema } from "@aperturs/db";

export const linkedinAiRouter = createTRPCRouter({
  generateLinkedinPostBasedOnIdea: protectedProcedure
    .input(
      z.object({
        idea: z.string(),
      }),
    )
    .mutation(async function* ({ input, ctx }) {
      console.log(input, "input");

      yield* generateLinkedinPostBasedOnTopic(input.idea, ctx.currentUser);
    }),
  generateLinkedinPostWithoutIdeas: protectedProcedure.mutation(
    async ({ ctx }) => {
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.clerkUserId, ctx.currentUser),
      });
      if (!user?.personalization) {
        throw new Error("User details not found");
      }
      const userDetails = user?.personalization as PersonalPreferenceType;
      console.log(userDetails, "userDetails");
      const res = await generatePostDirectly({
        userDetails,
      });
      return res;
    },
  ),
  generateLinkedinPostBasedOnUrl: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        urlType: z.enum(["url", "youtube"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.clerkUserId, ctx.currentUser),
      });
      if (!user?.personalization) {
        throw new Error("User details not found");
      }
      const userDetails = user?.personalization as PersonalPreferenceType;
      console.log(userDetails, "userDetails");

      let extractedText = "";
      if (input.urlType === "youtube") {
        extractedText = await extractYoutubeFromUrl(input.url);
        console.log(extractedText, "summarizeText");
      } else {
        extractedText = await getMarkdownFromArticle(input.url);
      }
      const summary = await summarizeText(extractedText);

      const generatedPost = await generateLinkedinPostBasedOnLongText(
        summary.text,
        userDetails,
      );
      return generatedPost;
    }),
});
