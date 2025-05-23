import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    WEBHOOK_SECRET: z.string().min(1),
    TWITTER_CALLBACK_URL: z.string().url(),
    GITHUB_CALLBACK_URL: z.string().url(),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    LINKEDIN_CLIENT_ID: z.string().min(1),
    LINKEDIN_CALLBACK_URL: z.string().url(),
    LINKEDIN_CLIENT_SECRET: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CRONJOB_AUTH: z.string(),
    CRONJOB_SCHEDULE_URL: z.string().url(),
    OPENAI_API_KEY: z.string(),
    RESEND_EMAIL_API: z.string(),
    DOMAIN: z.string(),
    INIVITE_WEBHOOK: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
