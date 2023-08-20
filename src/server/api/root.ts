import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { twitterData } from "./routers/twitter/twitter";
import { linkedin } from "./routers/linkedin/linkedin";
import { posting } from "./routers/post/post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  twitter: twitterData,
  linkedin: linkedin,
  userPost: posting

});

// export type definition of API
export type AppRouter = typeof appRouter;
