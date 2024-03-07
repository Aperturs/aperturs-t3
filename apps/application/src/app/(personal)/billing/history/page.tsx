import { Suspense } from "react";

import FetchAllSubscriptions from "../_subscription/fetch-all-subscriptions";
import SubscriptionSkeleton from "../_subscription/sub-skeleton";

export const metadata = {
  title: "Aperturs | Billing",
};

export default async function Billing() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Transaction History</h1>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <FetchAllSubscriptions />
      </Suspense>
    </section>
  );
}
