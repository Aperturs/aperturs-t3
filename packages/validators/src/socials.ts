import { z } from "zod";

export const SocialRedisKeySchema = z.object({
  orgId: z.string().default("personal"),
  tokenId: z.string().optional().default("new"),
  onboarding: z.boolean().optional().default(false),
});

export type SocialRedisKeyType = z.infer<typeof SocialRedisKeySchema>;

export const addTwitterSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  redis: SocialRedisKeySchema,
});

export type addTwitterType = z.infer<typeof addTwitterSchema>;

export type SearchParams = Record<string, string | string[] | undefined>;

export const addInstagramSchema = z.object({
  data_access_expiration_time: z.number(),
  access_token: z.string(),
  expires_in: z.number(),
  long_lived_token: z.string(),
});

export interface FBPageIgConnectDataArray {
  data: FbPageConnectData[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

export interface FbPageConnectData {
  id: string;
  name: string;
  instagram_business_account?: {
    id: string;
  };
  picture: {
    data: {
      url: string;
    };
  };
  connected_instagram_account?: {
    id: string;
  };
}
