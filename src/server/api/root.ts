import { createTRPCRouter } from "~/server/api/trpc";
import { linkedin } from "./routers/linkedin/linkedin";
import { posting } from "./routers/post/draft";
import { post } from "./routers/post/post";
import { twitterData } from "./routers/twitter/twitter";
import { userRouter } from "./routers/user";
import { github } from "./routers/github/github";
import { subscriptionData } from "./routers/subscription/lemonSqueezy";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  twitter: twitterData,
  linkedin: linkedin,
  github: github,
  savepost: posting,
  post: post,
  subscription: subscriptionData,
});

// export type definition of API
export type AppRouter = typeof appRouter;
