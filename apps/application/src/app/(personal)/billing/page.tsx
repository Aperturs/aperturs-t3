import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";

import FetchPlans from "./_plans/plans";
import PlansSkeleton from "./_plans/skeleton";
import FetchCurrentSubscription from "./_subscription/fetch-current-subscription";
import HistoryIcon from "./_subscription/hisotry-icon";
import SubscriptionSkeleton from "./_subscription/sub-skeleton";

export const metadata = {
  title: "Aperturs | Billing",
};

export default async function Billing() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex w-full items-center justify-between px-2">
        <h1 className="text-2xl font-bold">Billing</h1>
        <HistoryIcon />
      </div>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <FetchCurrentSubscription />
      </Suspense>
      <Tabs defaultValue="monthly">
        <div className="flex w-full items-center justify-center">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <div className="mx-2 my-0 text-xs font-bold text-green-600 dark:text-green-400">
            <p>Free 2 months</p>
            <p>billed yearly</p>
          </div>
          <div>
            {/* <span className="text-sm text-gray-500">Billed</span>
            <span className="text-sm text-gray-500">Annually</span>
            <span className="text-sm text-gray-500">Save 20%</span> */}
          </div>
        </div>
        <TabsContent value="monthly">
          <Suspense fallback={<PlansSkeleton />}>
            <FetchPlans interval="month" />
          </Suspense>
        </TabsContent>
        <TabsContent value="yearly">
          <Suspense fallback={<PlansSkeleton />}>
            <FetchPlans interval="year" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </section>
  );
}
