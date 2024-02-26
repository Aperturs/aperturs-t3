import { limitWrapper, verifyLimitAndRun } from "@api/helpers/limitWrapper";
import { redis } from "@api/index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db, schema, tokens } from "@aperturs/db";
import { postToLinkedInInputSchema } from "@aperturs/validators/post";

import { env } from "../../../env";
import { postToLinkedin } from "../../helpers/linkedln";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const linkedin = createTRPCRouter({
  postToLinkedin: protectedProcedure
    .input(postToLinkedInInputSchema)
    .mutation(async ({ input }) => {
      try {
        await postToLinkedin(input);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error posting to linkedin",
        });
      }
    }),
  addLinkedlnToDatabase: protectedProcedure
    .input(tokens.linkedInTokenInsertSchema)
    .mutation(async ({ ctx, input }) => {
      await limitWrapper(
        async () => await db.insert(schema.linkedInToken).values(input),
        ctx.currentUser,
        "socialaccounts",
      );
    }),

  getLinkedinAuthUrl: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(({ input, ctx }) => {
      const res = verifyLimitAndRun({
        func: async () => {
          await redis.set(ctx.currentUser, input.orgId, {
            ex: 120,
          });
          return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${env.LINKEDIN_CLIENT_ID}&redirect_uri=${env.LINKEDIN_CALLBACK_URL}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
        },
        clerkUserId: ctx.currentUser,
        limitType: "socialaccounts",
      });
      return res;
    }),
});
