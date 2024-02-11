import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/webhooks/user",
    "/api/callback/twitter",
    "/api/post/schedule",
    "/api/test",
    "/api/callback/github",
    "/api/webhooks/subscription",
  ],
  apiRoutes: ["/api/callback/linkedin"],
  ignoredRoutes: ["/api/trigger"],
  // debug: process.env.NODE_ENV === "development",
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/(api|callback)(.*)",
  ],
};
