import { clerkClient } from "@clerk/nextjs";

import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import {
  createOrganisation,
  getUserOrganisations,
} from "@api/handlers/organisation/main";
import { createOrganisationSchema } from "@api/handlers/organisation/organisation-types";
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
