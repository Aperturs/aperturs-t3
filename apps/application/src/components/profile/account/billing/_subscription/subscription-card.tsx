import type { subscriptions } from "@aperturs/db";
import type { BadgeProps } from "@aperturs/ui/badge";
import type { SubscriptionStatusType } from "@aperturs/validators/subscription";
import { Plans } from "@aperturs/api";
import { Badge } from "@aperturs/ui/badge";
import { Card, CardContent } from "@aperturs/ui/card";
import { cn } from "@aperturs/ui/lib/utils";
import { isValidSubscription } from "@aperturs/validators/subscription";

import { formatDate, formatPrice } from "~/utils/basic-functions";
import { SubscriptionActions } from "./subscription-actions";

export default async function SubscriptionCard({
  subscriptions,
}: {
  subscriptions: subscriptions.SubscriptionSelect[];
}) {
  return (
    <Card className="relative my-4">
      {subscriptions.map((subscription) => {
        const plan = Plans.find((p) => p.variantId === subscription.planId);
        const status = subscription.status as SubscriptionStatusType;

        if (!plan) {
          // throw new Error("Plan not found");
          return (
            <div className="p-6" key={subscription.id}>
              <p>Plan not found</p>
            </div>
          );
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

            <div className="flex flex-wrap items-center gap-2">
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
            </div>
          </div>
        );
      })}
      {subscriptions.length === 0 && (
        <div className="flex items-center justify-center p-5">
          <p className="text-surface-300">
            You currently dont have any subscriptions
          </p>
        </div>
      )}
    </Card>
  );
}

export function SubscriptionPrice({
  endsAt,
  price,
  interval,
  intervalCount,
  isUsageBased,
}: {
  endsAt?: string | null;
  price: string;
  interval?: string | null;
  intervalCount?: number | null;
  isUsageBased?: boolean;
}) {
  if (endsAt) return null;

  let formattedPrice = formatPrice(price);

  console.debug(formattedPrice, "formatted");

  if (isUsageBased) {
    formattedPrice += "/unit";
  }

  const formattedIntervalCount =
    intervalCount && intervalCount !== 1 ? `every ${intervalCount} ` : "every";

  return <p>{`$${formattedPrice} ${formattedIntervalCount} ${interval}`}</p>;
}

export function SubscriptionStatus({
  status,
  statusFormatted,
  isPaused,
}: {
  status: SubscriptionStatusType;
  statusFormatted: string;
  isPaused?: boolean;
}) {
  const statusColor: Record<SubscriptionStatusType, BadgeProps["color"]> = {
    active: "bg-green-600 hover:bg-green-700 ",
    cancelled: "bg-gray-600 hover:bg-gray-700",
    expired: "bg-red-600 hover:bg-red-700",
    past_due: "bg-red-600 hover:bg-red-700",
    on_trial: "primary",
    unpaid: "bg-red-600 hover:bg-red-700",
    pause: "bg-yellow-600 hover:bg-yellow-700",
    paused: "bg-yellow-600 hover:bg-yellow-700",
  };

  const _status = isPaused ? "paused" : status;
  const _statusFormatted = isPaused ? "Paused" : statusFormatted;

  return (
    <>
      {status !== "cancelled" && (
        <span className="text-surface-200">&bull;</span>
      )}

      <Badge
        className={`rounded-sm  text-xs  ${statusColor[_status]}`}
        color={statusColor[_status]}
      >
        {_statusFormatted}
      </Badge>
    </>
  );
}

export function SubscriptionDate({
  endsAt,
  renewsAt,
  trialEndsAt,
}: {
  endsAt?: string | null;
  renewsAt?: string | null;
  status: SubscriptionStatusType;
  trialEndsAt?: string | null;
}) {
  const now = new Date();
  const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : null;
  const endsAtDate = endsAt ? new Date(endsAt) : null;
  let message = `Renews on ${formatDate(renewsAt)}`;

  if (!trialEndsAt && !renewsAt) return null;

  if (trialEndDate && trialEndDate > now) {
    message = `Ends on ${formatDate(trialEndsAt)}`;
  }

  if (endsAt) {
    message =
      endsAtDate && endsAtDate < now
        ? `Expired on ${formatDate(endsAt)}`
        : `Expires on ${formatDate(endsAt)}`;
  }

  return (
    <>
      {<span className="text-surface-200">&bull;</span>}
      <p>{message}</p>
    </>
  );
}
