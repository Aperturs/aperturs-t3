import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createOrganisation } from "~/server/functions/organisation/main";
import { createOrganisationSchema } from "~/server/functions/organisation/organisation-types";

export const organisationRouter = createTRPCRouter({
  createOrganisation: protectedProcedure
    .input(createOrganisationSchema.omit({ clerkID: true }))
    .mutation(async ({ input, ctx }) => {
      const res = await createOrganisation({
        clerkID: ctx.currentUser,
        ...input,
      });
      return res;
    }),
});
