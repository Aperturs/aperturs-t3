import { updateUserPrivateMetadata } from "@api/handlers/metadata/user-private-meta";
import {
  createOrganisation,
  getUserOrganisations,
} from "@api/handlers/organisation/main";
import { limitWrapper } from "@api/helpers/limitWrapper";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { z } from "zod";

import { eq, organisation, schema } from "@aperturs/db";

export const organisationBasic = createTRPCRouter({
  getOrgIdfromSlug: protectedProcedure
    .input(
      z.object({
        orgslug: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.db.query.organization.findFirst({
        where: eq(schema.organization.id, input.orgslug),
      });
      if (!res) {
        throw new Error("Organisation not found");
      }
      return res.clerkOrgId;
    }),
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

  checkOrganisationCreationLimit: protectedProcedure.mutation(
    async ({ ctx }) => {
      const limit = await ctx.db.query.userUsage.findFirst({
        where: eq(schema.userUsage.clerkUserId, ctx.currentUser),
      });

      if (!limit) {
        throw new Error("Uplease upgrade your plan to create an organisation");
      }

      const available = limit?.organisation > 0;
      if (!available) {
        throw new Error("Organisation Creation limit reached");
      }

      return available;
    },
  ),

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
