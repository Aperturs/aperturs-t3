import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    OPENAI_API_KEY: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CALLBACK_URL: z.string().min(1),
    RESEND_EMAIL_API: z.string().min(1),
    TWITTER_CALLBACK_URL: z.string().min(1),
    LINKEDIN_CLIENT_ID: z.string().min(1),
    LINKEDIN_CALLBACK_URL: z.string().min(1),
    FACEBOOK_CLIENT_ID: z.string().min(1),
    FACEBOOK_CALLBACK_URL: z.string().min(1),
    FACEBOOK_CLIENT_SECRET: z.string().min(1),
    REDISURL: z.string().min(1),
    REDISTOKEN: z.string().min(1),
    REDISDATABASE: z.string().min(1),
    DOMAIN: z.string().min(1),
    LEMONSQUEEZY_KEY: z.string().min(1),
    LEMONSQUEEZY_STORE_ID: z.string().min(1),
    LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_YT_CALLBACK_URL: z.string().url(),
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET_NAME: z.string(),
    ECS_SECURITY_GROUP_ID: z.string(),
    ECS_CLUSTER_NAME: z.string(),
    ECS_TASK_DEFINITION_ARN: z.string(),
    ECS_CONTAINER_NAME: z.string(),
    LAMBDA_HIT_ROUTE_ARN: z.string(),
    SCHEDULAR_IAM_ROLE_ARN: z.string(),
    TWITTER_APIKEY: z.string(),
    TWITTER_APPSECRET: z.string(),
    TWITTER_ACCESSTOKEN: z.string(),
    TWITTER_ACCESSSECRET: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
