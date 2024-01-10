import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  WEBHOOK_SECRET: z.string().min(1),
  TWITTER_CALLBACK_URL: z.string().url(),
  NEXT_PUBLIC_GITHUB_CALLBACK_URL: z.string().url(),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_LINKEDIN_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_LINKEDIN_CALLBACK_URL: z.string().url(),
  LINKEDIN_CLIENT_SECRET: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CRONJOB_AUTH: z.string(),
  CRONJOB_SCHEDULE_URL: z.string().url(),
  OPENAI_API_KEY: z.string(),
  NEXT_PRIVATE_LEMONSQUEEZY_KEY: z.string(),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_LINKEDIN_CLIENT_ID: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_LINKEDIN_CALLBACK_URL: z.string().url(),
  NEXT_PUBLIC_GITHUB_CALLBACK_URL: z.string().url(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
  NEXT_PUBLIC_GITHUB_CALLBACK_URL: process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_LINKEDIN_CLIENT_ID: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_LINKEDIN_CALLBACK_URL:
    process.env.NEXT_PUBLIC_LINKEDIN_CALLBACK_URL,
  CRONJOB_AUTH: process.env.CRONJOB_AUTH,
  CRONJOB_SCHEDULE_URL: process.env.CRONJOB_SCHEDULE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PRIVATE_LEMONSQUEEZY_KEY: process.env.NEXT_PRIVATE_LEMONSQUEEZY_KEY,

  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
