import {
  generateLinkedinPostBasedOnTopic,
  generatePostDirectly,
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
});
