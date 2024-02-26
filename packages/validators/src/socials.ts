import { z } from "zod";

export const addTwitterSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  orgId: z.string(),
});

export type addTwitterType = z.infer<typeof addTwitterSchema>;
