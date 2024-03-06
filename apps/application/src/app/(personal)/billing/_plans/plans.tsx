import BillingCard from "~/app/(personal)/billing/_plans/payment-cards";
import { api } from "~/trpc/server";

type PlanIntervel = "month" | "year";

export default async function FetchPlans({
  interval,
}: {
  interval: PlanIntervel;
}) {
  const plans = await api.subscription.getAllPlans();
  const currentSubscription = await api.subscription.getCurrentSubscription();

  const filteredPlans = plans.filter((plan) => plan.interval === interval);
  const currentPlan = plans.find(
    (plan) => plan.variantId === currentSubscription?.planId,
  );

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {filteredPlans.map((plan) => (
        <BillingCard
          key={plan.variantId}
          plan={plan}
          currentPlan={currentPlan}
        />
      ))}
    </section>
  );
}
