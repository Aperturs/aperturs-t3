import type { SubscriptionStatusType } from "@aperturs/validators/subscription";
import { Plans } from "@aperturs/api";
import { Card } from "@aperturs/ui/components/ui/card";
import { cn } from "@aperturs/ui/lib/utils";
import { isValidSubscription } from "@aperturs/validators/subscription";

import { api } from "~/trpc/server";
import { SubscriptionActions } from "./subscription-actions";

export default async function SubscriptionCard() {
  const subscriptions = await api.subscription.getSubscriptions();

  return (
    <Card className="my-4">
      {subscriptions.map((subscription) => {
        const plan = Plans.find((p) => p.variantId === subscription.planId);
        const status = subscription.status as SubscriptionStatusType;

        if (!plan) {
          throw new Error("Plan not found");
        }
        return (
          <div
            key={subscription.id}
            className="border-surface-200 dark:border-surface-800 flex-col items-stretch  justify-center gap-2 border-b p-5"
          >
            <header className="flex flex-row items-center justify-between gap-3">
              <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1">
                <h2
                  className={cn(
                    "text-surface-900 text-lg",
                    !isValidSubscription(status) && "text-inherit",
                  )}
                >
                  {plan.productName} ({plan.variantName})
                </h2>
              </div>

              {/* {isValidSubscription(status) && (
                  <ChangePlan planId={subscription.planId} />
                )} */}

              <SubscriptionActions subscription={subscription} />
            </header>

            {/* <div className="flex flex-wrap items-center gap-2">
              <SubscriptionPrice
                endsAt={subscription.endsAt}
                interval={plan.interval}
                intervalCount={plan.intervalCount}
                price={subscription.price}
                isUsageBased={plan.isUsageBased ?? false}
              />

              <SubscriptionStatus
                status={status}
                statusFormatted={subscription.statusFormatted}
                isPaused={Boolean(subscription.isPaused)}
              />

              <SubscriptionDate
                endsAt={subscription.endsAt}
                renewsAt={subscription.renewsAt}
                status={status}
                trialEndsAt={subscription.trialEndsAt}
              />
            </div> */}
          </div>
        );
      })}
    </Card>
  );
}
