import { getInstagramRedirectUrl } from "@api/handlers/meta/instagram";
import { verifyLimitAndRun } from "@api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { redis } from "@api/utils/redis";

import { SocialRedisKeySchema } from "@aperturs/validators/socials";

export const instagramRouter = createTRPCRouter({
  getInstagramRedirectUrl: protectedProcedure
    .input(SocialRedisKeySchema)
    .query(({ input, ctx }) => {
      const res = verifyLimitAndRun({
        func: async () => {
          await redis.set(ctx.currentUser, input, {
            ex: 120,
          });
          return getInstagramRedirectUrl();
        },
        clerkUserId: ctx.currentUser,
        limitType: "socialaccounts",
      });
      return res;
    }),
});
