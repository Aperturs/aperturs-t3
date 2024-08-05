import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import type { PrivateMetaData } from "@aperturs/validators/private_metadata";
import { privateMetaDataSchema } from "@aperturs/validators/private_metadata";

export const metaDataRouter = createTRPCRouter({
  getUserPrivateMetaData: protectedProcedure.query(async ({ ctx }) => {
    const user = await clerkClient.users.getUser(ctx.currentUser);
    const metadata = user.privateMetadata as PrivateMetaData;

    return metadata;
  }),
  updateUserPrivateMetaData: publicProcedure
    .input(
      privateMetaDataSchema.partial().and(
        z.object({
          userId: z.string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      const user = await clerkClient.users.getUser(input.userId);
      const metadata = user.privateMetadata as PrivateMetaData;

      let updatedOrganisations = [];

      if (metadata?.organisations) {
        updatedOrganisations = [
          ...metadata.organisations,
          ...(input.organisations ?? []),
        ];
      } else {
        updatedOrganisations = [...(input.organisations ?? [])];
      }

      await clerkClient.users.updateUserMetadata(input.userId, {
        privateMetadata: {
          organisations: updatedOrganisations,
          lsSubscriptionId: input.lsSubscriptionId,
          lsCustomerId: input.lsCustomerId,
          lsVariantId: input.lsVariantId,
          lsCurrentPeriodEnd: input.lsCurrentPeriodEnd,
          currentPlan: input.currentPlan,
        },
        publicMetadata: {
          currentPlan: input.currentPlan,
        },
      });
    }),
});
