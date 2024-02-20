import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createOrganisation,
  getUserOrganisations,
} from "~/server/functions/organisation/main";
import { createOrganisationSchema } from "~/server/functions/organisation/organisation-types";
import { updateUserPrivateMetadata } from "~/utils/actions/user-private-meta";
import { limitWrapper } from "../../helpers/limitWrapper";

export const organisationBasic = createTRPCRouter({
  createOrganisation: protectedProcedure
    .input(createOrganisationSchema.omit({ clerkID: true }))
    .mutation(async ({ input, ctx }) => {
      const res = await limitWrapper(
        () =>
          createOrganisation({
            clerkID: ctx.currentUser,
            ...input,
          }),
        ctx.currentUser,
        "organisation",
      );
      const orgId = res.id;
      await clerkClient.users.updateUserMetadata(ctx.currentUser, {
        privateMetadata: {
          organisation: {
            id: orgId,
            role: "OWNER",
          },
        },
      });
      await updateUserPrivateMetadata({
        organisations: [
          {
            orgId: orgId,
            role: "OWNER",
          },
        ],
      });
      return res;
    }),

  getAllUserOrganisations: protectedProcedure.query(async ({ ctx }) => {
    const res = await getUserOrganisations(ctx.currentUser);
    return res;
  }),
});
