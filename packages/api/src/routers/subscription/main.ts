import { FetchPlans } from "@api/handlers/subscription/main";
import { createTRPCRouter, protectedProcedure } from "@api/trpc";

export const subscriptionRouter = createTRPCRouter({
  fetchPlans: protectedProcedure.query(async () => {
    return await FetchPlans();
  }),
});
