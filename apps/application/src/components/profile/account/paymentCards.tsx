"use client";

import { Button } from "@aperturs/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@aperturs/ui/card";

interface iFeatureList {
  name: string;
  pricing: number;
  onClick?: () => void;
  features: string[];
  unavailableFeatures?: string[];
  id: string;
  currentPlan?: string;
}

export default function BillingCard({
  name,
  pricing,
  onClick,
  features,
  id,
  currentPlan,
}: iFeatureList) {
  const available = true;
  // const subscribe = api.subscriptions.createCheckout.useMutation();

  // const handleSubscribe = async (productId: string) => {
  //   await subscribe({ productId: parseInt(productId) }).then((res) => {
  //     console.log(res);
  //     // window.location.href = res;
  //   });
  // };
  return (
    <Card
      className={` ${
        name === currentPlan ? "border-blue-gray-900 border-2" : ""
      }`}
    >
      <CardHeader>
        <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
          {name}
        </h5>
        <div className="flex items-baseline text-gray-900 dark:text-white">
          <span className="text-3xl font-semibold">$</span>
          <span className="text-5xl font-extrabold tracking-tight">
            {pricing}
          </span>
          <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
            /month
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="my-7 space-y-5">
          {features.map((name) => (
            <li
              className={`flex space-x-3 ${
                !available ? "line-through decoration-gray-500" : ""
              }`}
              key={name}
            >
              <svg
                className={`h-5 w-5 shrink-0 ${
                  available
                    ? "text-primary dark:text-primary"
                    : "text-gray-400 dark:text-gray-500"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {available ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0
                    00-1.414-1.414L9 10.586 7.707 9.293a1 1 0
                    00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0
                    000 16zm3.707-9.293a1 1 0
                    00-1.414-1.414L9 10.586 7.707 9.293a1 1 0
                    00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          // onClick={async () => {
          //   await subscribe.mutateAsync({ productId: parseInt(id) });
          // }}
        >
          Choose plan
        </Button>
      </CardFooter>
    </Card>
  );
}
