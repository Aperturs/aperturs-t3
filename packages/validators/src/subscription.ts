import type { Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { z } from "zod";

export const featureName = z.enum([
  "Social accounts",
  "Schedule into the future",
  "Scheduled posts",
  "Save as drafts",
  "AI Tokens",
  "History",
]);

export type FeatureNameType = z.infer<typeof featureName>;

export const feature = z.object({
  name: featureName,
  baseValue: z.string().or(z.number()).or(z.boolean()),
  description: z.string(),
});

export type FeatureType = z.infer<typeof feature>;

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
  features: z.array(feature),
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
