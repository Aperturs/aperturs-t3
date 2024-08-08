"use client";

import type { ComponentProps, ElementRef } from "react";
import { forwardRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import type { PlansType } from "@aperturs/validators/subscription";
// import { changePlan, getCheckoutURL } from "@/app/actions";
import { Button } from "@aperturs/ui/button";

import { api } from "~/trpc/react";

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button> & {
  embed?: boolean;
  isChangingPlans?: boolean;
  currentPlan?: PlansType;
  plan: PlansType;
};

// eslint-disable-next-line react/display-name
export const SignupButton = forwardRef<ButtonElement, ButtonProps>(
  (props, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
      embed = true,
      plan,
      currentPlan,
      isChangingPlans = false,
      ...otherProps
    } = props;

    const isCurrent = currentPlan?.variantId === plan.variantId;

    console.log("currentPlan", currentPlan);

    const switchLabel =
      currentPlan?.sort && currentPlan.sort > plan.sort
        ? "Downgrade"
        : "Upgrade";

    const label = isCurrent
      ? "Your plan"
      : isChangingPlans
        ? switchLabel
        : "Subscribe";

    const { data: getCheckoutURL } =
      api.subscription.getSubscriptionUrl.useQuery({
        variantId: plan.variantId,
        embed,
      });
    const { mutateAsync: changePlan } =
      api.subscription.changePlan.useMutation(); // Make sure Lemon.js is loaded

    useEffect(() => {
      if (typeof window.createLemonSqueezy === "function") {
        window.createLemonSqueezy();
      }
    }, []);

    return (
      <Button
        ref={ref}
        disabled={loading || isCurrent || props.disabled}
        onClick={async () => {
          // If changing plans, call server action.
          setLoading(true);
          if (isChangingPlans) {
            if (!currentPlan?.variantId) {
              throw new Error("Current plan not found.");
            }

            if (!plan.variantId) {
              throw new Error("New plan not found.");
            }
            await changePlan({
              currentPlanId: currentPlan.variantId,
              newPlanId: plan.variantId,
            }).then(() => {
              router.refresh();
            });

            return;
          }

          // Otherwise, create a checkout and open the Lemon.js modal.
          let checkoutUrl: string | undefined = "";
          try {
            setLoading(true);
            checkoutUrl = getCheckoutURL;
          } catch (error) {
            setLoading(false);
            toast("Something went wrong", { icon: "🚨" });
          } finally {
            embed && setLoading(false);
          }

          embed
            ? checkoutUrl && window.LemonSqueezy.Url.Open(checkoutUrl)
            : router.push(checkoutUrl ?? "/");
          setLoading(false);
        }}
        {...otherProps}
      >
        {label}
      </Button>
    );
  },
);
