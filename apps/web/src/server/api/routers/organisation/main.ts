import { createTRPCRouter } from "~/server/api/trpc";
import { organisationBasic } from "./basics";
import { OrganizationTeam } from "./team";

export const organisationRouter = createTRPCRouter({
  basics: organisationBasic,
  team: OrganizationTeam,
});
