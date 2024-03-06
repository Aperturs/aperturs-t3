import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";

import FetchPlans from "./_plans/plans";
import PlansSkeleton from "./_plans/skeleton";
import SubscriptionSkeleton from "./_subscription/sub-skeleton";
import SubscriptionCard from "./_subscription/subscription-card";

export const metadata = {
  title: "Billing",
};

export default async function Billing() {
  return (
    <section className="flex flex-col gap-2">
      <h1>Billing</h1>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionCard />
      </Suspense>
      <Tabs defaultValue="monthly">
        <div className="flex w-full items-center justify-center">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
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
