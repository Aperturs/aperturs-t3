import React from "react";

import { api } from "~/trpc/server";
import SubscriptionCard from "./subscription-card";

export default async function FetchAllSubscriptions() {
  const subscriptions = await api.subscription.getSubscriptions();

  return <SubscriptionCard subscriptions={subscriptions} />;
}
