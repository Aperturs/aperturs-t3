import { z } from "zod";

export const plansSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  variantId: z.number(),
  variantName: z.string(),
  description: z.string(),
  price: z.string(),
  interval: z.string().optional(),
  intervalCount: z.number().optional(),
  trialInterval: z.string().optional(),
  trialIntervalCount: z.number().optional(),
  isUsageBased: z.boolean(),
  sort: z.number(),
});

export type PlansType = z.infer<typeof plansSchema>;
