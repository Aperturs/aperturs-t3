import { getSocialAccounts } from "@api/handlers/organisation/socials";
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
      const socials = await getSocialAccounts(input.orgId);
      // const youtube = await getOrganisationsYoutubeAccounts(input.orgId);
      const accounts = getAccounts(socials);
      return accounts;
    }),
});
