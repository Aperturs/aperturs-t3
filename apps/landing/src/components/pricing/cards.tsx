'use client'

import { useState } from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { Badge } from "@aperturs/ui/badge";
import { Button } from "@aperturs/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@aperturs/ui/card";
import { Switch } from "@aperturs/ui/switch";

export default function PricingComponent() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Solo Creator",
      description: "Perfect for individuals just starting out",
      price: { monthly: 19, yearly: 190 },
      features: [
        "4 Social accounts",
        "14 days Schedule into the future",
        "30 Scheduled posts",
        "25 Save as drafts",
        "1000 AI Tokens",
        "30 days History",
      ],
    },
    {
      name: "Small Business",
      description: "Ideal for growing teams and businesses",
      price: { monthly: 28, yearly: 280 },
      features: [
        "15 Social accounts",
        "60 days Schedule into the future",
        "500 Scheduled posts",
        "500 Save as drafts",
        "5000 AI Tokens",
        "60 days History",
      ],
      featured: true,
    },
    {
      name: "Business",
      description: "Advanced features for larger organizations",
      price: { monthly: 94, yearly: 940 },
      features: [
        "100 Social accounts",
        "Unlimited Schedule into the future",
        "Unlimited Scheduled posts",
        "Unlimited Save as drafts",
        "Unlimited AI Tokens",
        "Unlimited History",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-sm font-medium">Yearly</span>
            <Badge variant="secondary" className="ml-2">
              Save up to 17%
            </Badge>
          </div>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col justify-between ${
                plan.featured
                  ? "scale-105 shadow-lg ring-2 ring-primary"
                  : "shadow-md"
              }`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mt-6 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide">
                    {isYearly ? "/year" : "/month"}
                  </span>
                </div>
                {isYearly && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Billed annually (2 months free)
                  </p>
                )}
                <ul className="mt-8 space-y-3 text-sm leading-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <RiVerifiedBadgeFill
                        className="h-6 w-5 flex-none text-primary"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {plan.featured ? "Start free trial" : "Subscribe"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
