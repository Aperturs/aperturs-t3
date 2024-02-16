"use client";

import { Button } from "@aperturs/ui/button";
import { Card } from "@aperturs/ui/card";

export default function ManageSubscription({
  isCanceled,
  lsCurrentPeriodEnd,
  updatePaymentMethodURL,
}: {
  isCanceled: boolean;
  lsCurrentPeriodEnd: number;
  updatePaymentMethodURL: string;
}) {
  return (
    <Card className="my-6 w-full">
      <div className="flex items-center justify-between gap-2 p-5">
        <div>
          <h1 className="text-2xl font-semibold">Manage Subscription</h1>
          <p className="text-sm text-gray-500">
            {isCanceled
              ? "Your subscription is cancelled"
              : `Your subscription will renew on ${new Date(
                  lsCurrentPeriodEnd,
                ).toLocaleDateString()}`}
          </p>
        </div>
        <Button
          onClick={() => {
            window.location.href = updatePaymentMethodURL;
          }}
        >
          Change Plan
        </Button>
      </div>
    </Card>
  );
}
