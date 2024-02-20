import { z } from "zod";

import { organisationRole } from "~/server/functions/organisation/organisation-types";

export const privateMetaDataSchema = z.object({
  organisations: z.array(
    z.object({
      orgId: z.string(),
      role: organisationRole,
    }),
  ),
  lsSubscriptionId: z.string().optional(),
  lsCustomerId: z.string().optional(),
  lsVariantId: z.number().optional(),
  lsCurrentPeriodEnd: z.string().optional(),
});


export type PrivateMetaData = z.infer<typeof privateMetaDataSchema>;