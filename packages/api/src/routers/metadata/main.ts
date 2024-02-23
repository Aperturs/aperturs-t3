import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { clerkClient } from "@clerk/nextjs";

import type { PrivateMetaData } from "@aperturs/validators/private_metadata";

export const metaDataRouter = createTRPCRouter({
  getUserPrivateMetaData: protectedProcedure.query(async ({ ctx }) => {
    const user = await clerkClient.users.getUser(ctx.currentUser);
    const metadata = user.privateMetadata as PrivateMetaData;

    return metadata;
  }),
});
