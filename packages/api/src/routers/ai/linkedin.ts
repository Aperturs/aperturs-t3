import {
  generateLinkedinPost,
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
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.clerkUserId, ctx.currentUser),
      });
      const userDetails = user?.userDetails as PersonalPreferenceType;
      const res = await generateLinkedinPost({
        idea: input.idea,
        userDetails,
      });
      return res;
    }),
  generateLinkedinPostWithoutIdeas: protectedProcedure.mutation(
    async ({ ctx }) => {
      const user = await ctx.db.query.user.findFirst({
        where: eq(schema.user.clerkUserId, ctx.currentUser),
      });
      const userDetails = user?.personalization as PersonalPreferenceType;
      console.log(userDetails, "userDetails");
      const res = await generatePostDirectly({
        userDetails,
      });
      return res;
    },
  ),
});
