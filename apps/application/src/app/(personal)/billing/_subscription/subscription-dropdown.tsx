"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVerticalIcon } from "lucide-react";

import type { subscriptions } from "@aperturs/db";
import type { SubscriptionUrlsType } from "@aperturs/validators/subscription";
import { Button } from "@aperturs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aperturs/ui/dropdown-menu";

import SimpleLoader from "~/components/custom/loading/simple-loading";
import { api } from "~/trpc/react";
import {
  LemonSqueezyModaButton,
  LemonSqueezyModalLink,
} from "./lemon-modal-link";

export function SubscriptionActionsDropdown({
  subscription,
  urls,
}: {
  subscription: subscriptions.SubscriptionSelect;
  urls: Awaited<SubscriptionUrlsType | undefined>;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { mutateAsync: pauseUserSubscription } =
    api.subscription.pauseUserSubscription.useMutation();

  const { mutateAsync: resumeUserSubscription } =
    api.subscription.resumeUserSubscription.useMutation();

  const { mutateAsync: cancelUserSubscription } =
    api.subscription.cancelUserSubscription.useMutation();

  const { data: invoiceUrl } = api.subscription.getInvoice.useQuery({
    id: subscription.lemonSqueezyId,
  });

  console.log("subscription", subscription.id, subscription);

  if (
    subscription.status === "expired" ||
    subscription.status === "cancelled" ||
    subscription.status === "unpaid"
  ) {
    return (
      <>
        <LemonSqueezyModaButton href={invoiceUrl}>
          Generate Invoice
        </LemonSqueezyModaButton>
      </>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-10  flex items-center justify-center rounded-md bg-secondary opacity-35">
          <SimpleLoader />
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="z-10" align="end">
          <DropdownMenuGroup>
            {!subscription.isPaused && (
              <DropdownMenuItem
                onClick={async () => {
                  setLoading(true);
                  await pauseUserSubscription({
                    id: subscription.lemonSqueezyId,
                  }).then(() => {
                    setLoading(false);
                    router.refresh();
                  });
                }}
              >
                Pause payments
              </DropdownMenuItem>
            )}

            {subscription.isPaused && (
              <DropdownMenuItem
                onClick={async () => {
                  setLoading(true);
                  await resumeUserSubscription({
                    id: subscription.lemonSqueezyId,
                  }).then(() => {
                    setLoading(false);
                    router.refresh();
                  });
                }}
              >
                Resume payments
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <a href={urls?.customer_portal}>Customer portal ↗</a>
            </DropdownMenuItem>

            <LemonSqueezyModalLink href={urls?.update_payment_method}>
              Update payment method
            </LemonSqueezyModalLink>
          </DropdownMenuGroup>
          <LemonSqueezyModalLink href={invoiceUrl}>
            Generate Invoice
          </LemonSqueezyModalLink>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={async () => {
                if (
                  confirm(
                    `Please confirm if you want to cancel your subscription.`,
                  )
                ) {
                  setLoading(true);
                  await cancelUserSubscription({
                    id: subscription.lemonSqueezyId,
                  }).then(() => {
                    setLoading(false);
                    router.refresh();
                  });
                }
              }}
            >
              Cancel subscription
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
