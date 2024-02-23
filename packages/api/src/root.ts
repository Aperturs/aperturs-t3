import { createTRPCRouter } from "./trpc";
import { github } from "./routers/github/github";
import { linkedin } from "./routers/linkedin/linkedin";
import { organisationRouter } from "./routers/organisation/main";
import { posting } from "./routers/post/draft";
import { post } from "./routers/post/post";
import { subscriptionData } from "./routers/subscription/lemonSqueezy";
import { twitterData } from "./routers/twitter/twitter";
import { userRouter } from "./routers/user";

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
  subscriptions: subscriptionData,
  organisation: organisationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
