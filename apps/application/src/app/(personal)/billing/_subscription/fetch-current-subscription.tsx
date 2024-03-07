import { api } from "~/trpc/server";
import SubscriptionCard from "./subscription-card";

export default async function FetchCurrentSubscription() {
  const subscription = await api.subscription.getCurrentSubscription();

  const subscriptions = subscription ? [subscription] : [];

  return <SubscriptionCard subscriptions={subscriptions} />;
}
