import React, { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";

import FetchPlans from "~/components/profile/account/billing/_plans/plans";
import PlansSkeleton from "~/components/profile/account/billing/_plans/skeleton";

export default function Pricing() {
  return (
    <div className="flex h-full w-full flex-col items-center  px-8 py-36">
      <h1 className="my-3 text-center text-6xl font-bold">
        Start your free trial
      </h1>
      <p className="mb-8 text-center text-lg">
        You&apos;ll get 7 days for free - you can cancel anytime!
      </p>
      <Tabs defaultValue="monthly" className="w-full">
        <div className="flex w-full items-center justify-center">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <div className="mx-2 my-0 text-xs font-bold text-green-600 dark:text-green-400">
            <p>Free 2 months</p>
            <p>billed yearly</p>
          </div>
          <div></div>
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
    </div>
  );
}
