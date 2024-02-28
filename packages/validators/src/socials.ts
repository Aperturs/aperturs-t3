import { z } from "zod";

export const SocialRedisKeySchema = z.object({
  orgId: z.string().default("personal"),
  tokenId: z.string().optional().default("new"),
});

export type SocialRedisKeyType = z.infer<typeof SocialRedisKeySchema>;

export const addTwitterSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  redis: SocialRedisKeySchema,
});

export type addTwitterType = z.infer<typeof addTwitterSchema>;
