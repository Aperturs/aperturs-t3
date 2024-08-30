import Link from "next/link";

import { Button } from "@aperturs/ui/button";

import { api } from "~/trpc/server";

// import { completeOnboarding } from "../../_action";

export default async function PickPricingControls() {
  const subscription = await api.subscription.getCurrentSubscription();

  return (
    <div className="my-3 flex justify-between gap-2">
      <Button asChild className="w-full">
        <Link href="/onboarding/add-social">Back</Link>
      </Button>
      {subscription && (
        <Button asChild className="w-full">
          <Link href="/onboarding/details">Next</Link>
        </Button>
      )}
    </div>
  );
}
