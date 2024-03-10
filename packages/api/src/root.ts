import { github } from "./routers/github/github";
import { linkedin } from "./routers/linkedin/linkedin";
import { instagramRouter } from "./routers/meta/instagram";
import { metaDataRouter } from "./routers/metadata/main";
import { organisationRouter } from "./routers/organisation/main";
import { posting } from "./routers/post/draft";
import { post } from "./routers/post/post";
import { subscriptionRouter } from "./routers/subscription/main";
import { twitterData } from "./routers/twitter/twitter";
import { userRouter } from "./routers/user";
import { youtubeRouter } from "./routers/youtube/main";
import { createTRPCRouter } from "./trpc";

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
  organisation: organisationRouter,
  metadata: metaDataRouter,
  instagram: instagramRouter,
  subscription: subscriptionRouter,
  youtube: youtubeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
