import { updateUserPrivateMetadata } from "@api/handlers/metadata/user-private-meta";
import {
  createOrganisation,
  getUserOrganisations,
} from "@api/handlers/organisation/main";
import { limitWrapper } from "@api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";

import { organisation } from "@aperturs/db";

export const organisationBasic = createTRPCRouter({
  createOrganisation: protectedProcedure
    .input(
      organisation.organisationInsertSchema.omit({
        clerkUserId: true,
        updatedAt: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const res = await limitWrapper(
        () =>
          createOrganisation({
            clerkUserId: ctx.currentUser,
            ...input,
          }),
        ctx.currentUser,
        "organisation",
      );
      if (!res) {
        throw new Error("Failed to create organisation");
      }
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
    const orgs = res.map((user) => {
      return {
        ...user.organization,
        role: user.role,
      };
    });
    return orgs;
  }),
});
