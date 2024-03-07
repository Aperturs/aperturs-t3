import type { Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { z } from "zod";

export const plansSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  variantId: z.number(),
  variantName: z.string(),
  description: z.string(),
  price: z.string(),
  important: z.boolean().optional(),
  interval: z.string().optional(),
  intervalCount: z.number().optional(),
  trialInterval: z.string().optional(),
  trialIntervalCount: z.number().optional(),
  isUsageBased: z.boolean(),
  sort: z.number(),
  power: z.number(),
});

export type PlansType = z.infer<typeof plansSchema>;

export type SubscriptionStatusType =
  Subscription["data"]["attributes"]["status"];

export function isValidSubscription(
  status: Subscription["data"]["attributes"]["status"],
) {
  return status !== "cancelled" && status !== "expired" && status !== "unpaid";
}

export interface SubscriptionUrlsType {
  update_payment_method: string;
  customer_portal: string;
  customer_portal_update_subscription: string;
}
