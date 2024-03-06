import type { subscriptions } from "@aperturs/db";

import { api } from "~/trpc/server";
import { SubscriptionActionsDropdown } from "./subscription-dropdown";

export async function SubscriptionActions({
  subscription,
}: {
  subscription: subscriptions.SubscriptionSelect;
}) {
  if (
    subscription.status === "expired" ||
    subscription.status === "cancelled" ||
    subscription.status === "unpaid"
  ) {
    return null;
  }

  const urls = await api.subscription.getSubscriptionURLs({
    id: subscription.lemonSqueezyId,
  });

  return (
    <>
      <SubscriptionActionsDropdown subscription={subscription} urls={urls} />
    </>
  );
}
