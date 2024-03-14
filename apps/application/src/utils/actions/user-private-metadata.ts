import { z } from "zod";

import { organisationRoleSchema } from "@aperturs/validators/organisation";

export const privateMetaDataSchema = z.object({
  organisations: z.array(
    z.object({
      orgId: z.string(),
      role: organisationRoleSchema,
    }),
  ),
  currentPlan: z.enum(["FREE", "PRO", "PRO2", "PRO3"]),
  lsSubscriptionId: z.string().optional(),
  lsCustomerId: z.string().optional(),
  lsVariantId: z.number().optional(),
  lsCurrentPeriodEnd: z.string().optional(),
});

export type PrivateMetaData = z.infer<typeof privateMetaDataSchema>;

export const publicMetaDataSchema = z.object({
  currentPlan: z.enum(["FREE", "PRO", "PRO2", "PRO3"]),
});

export type PublicMetaData = z.infer<typeof publicMetaDataSchema>;
