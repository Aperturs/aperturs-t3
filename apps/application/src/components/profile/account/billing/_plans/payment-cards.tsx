"use client";

import { Info, InfoIcon } from "lucide-react";

import type { PlansType } from "@aperturs/validators/subscription";
import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";
import ToolTipSimple from "@aperturs/ui/tooltip-final";

import { formatPrice } from "~/utils/basic-functions";
import { SignupButton } from "./plan-button";

interface iFeatureList {
  plan: PlansType;
  currentPlan?: PlansType;
}

export default function BillingCard({ plan, currentPlan }: iFeatureList) {
  const isCurrentPlan = plan.variantId === currentPlan?.variantId;

  const colorImportant = plan.important
    ? "text-white"
    : "text-gray-500 dark:text-gray-400";

  const isChangingPlans = currentPlan && !isCurrentPlan;

  return (
    <Card
      className={` ${isCurrentPlan ? "border-2 border-green-600 dark:border-2 " : ""} ${plan.important ? "bg-zinc-800" : ""}`}
    >
      <CardHeader>
        <h5 className={`mb-4 text-xl font-medium ${colorImportant}`}>
          {plan.productName}
        </h5>
        <div
          className={`flex items-baseline ${plan.important ? "text-white dark:text-white" : ""}`}
        >
          <span className="text-3xl font-semibold">$</span>
          <span className="text-5xl font-extrabold tracking-tight">
            {formatPrice(plan.price)}
          </span>
          <span className={`ml-1 text-xl font-normal  ${colorImportant}`}>
            /{plan.interval}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="my-7 space-y-5">
          {plan.features.map((feature) => (
            <li className={`flex space-x-3 items-center`} key={feature.name}>
              <svg
                className={`h-5 w-5 shrink-0 text-primary dark:text-primary`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0
                    00-1.414-1.414L9 10.586 7.707 9.293a1 1 0
                    00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                {feature.baseValue}
              </span>
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                {feature.name}
              </span>
              <ToolTipSimple content={feature.description}>
                <InfoIcon className="size-4" />
              </ToolTipSimple>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <SignupButton
          className={`w-full ${plan.important ? "bg-black text-primary hover:bg-slate-50 dark:text-primary" : ""}`}
          plan={plan}
          isChangingPlans={isChangingPlans}
          currentPlan={currentPlan}
        />
      </CardFooter>
    </Card>
  );
}
