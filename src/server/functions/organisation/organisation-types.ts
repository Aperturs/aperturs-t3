import { z } from "zod";

export const createOrganisationSchema = z.object({
  name: z.string(),
  clerkID: z.string(),
  logo: z.string().optional(),
});

export type CreateOrganisation = z.infer<typeof createOrganisationSchema>;
