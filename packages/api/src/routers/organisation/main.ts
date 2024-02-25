import { createTRPCRouter } from "@api/trpc";

import { organisationBasic } from "./basics";
import { organisationSocials } from "./socials";
import { OrganizationTeam } from "./team";

export const organisationRouter = createTRPCRouter({
  basics: organisationBasic,
  team: OrganizationTeam,
  socials: organisationSocials,
});
