import React, { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aperturs/ui/tabs";

import FetchPlans from "~/components/profile/account/billing/_plans/plans";
import PlansSkeleton from "~/components/profile/account/billing/_plans/skeleton";

export default function Pricing() {
  return (
    <div className="flex items-center justify-center flex-grow p-8 h-full w-full ">
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
    </div>
  );
}
