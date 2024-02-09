import { createTRPCRouter } from "~/server/api/trpc";
import { organisationBasic } from "./basics";

export const organisationRouter = createTRPCRouter({
  basics: organisationBasic,
});
