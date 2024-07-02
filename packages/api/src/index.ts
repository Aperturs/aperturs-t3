import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import { Plans } from "./handlers/subscription/plans";
import { leamonWebhookHasMeta } from "./helpers/type-guard";
import { appRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";
import { googleAuth2Client, youtubeClient } from "./utils/googe-yt";
import { configureLemonSqueezy } from "./utils/lemon-squeezy";

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export * from "@lemonsqueezy/lemonsqueezy.js";
export { redis } from "./utils/redis";
export {
  Plans,
  appRouter,
  configureLemonSqueezy,
  createCaller,
  createTRPCContext,
  googleAuth2Client,
  leamonWebhookHasMeta,
  youtubeClient,
};
export type { AppRouter, RouterInputs, RouterOutputs };
