import {
  getOrganisationsLinkedinAccounts,
  getOrganisationsTwitterAccounts,
} from "@api/handlers/organisation/socials";
import { getAccounts } from "@api/helpers/get-socials";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";
import { z } from "zod";

export const organisationSocials = createTRPCRouter({
  getAllSocials: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const linkedin = await getOrganisationsLinkedinAccounts(input.orgId);
      const twitter = await getOrganisationsTwitterAccounts(input.orgId);
      const accounts = getAccounts(linkedin, twitter);
      return accounts;
    }),
});
