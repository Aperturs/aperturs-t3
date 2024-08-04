import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/api/callback/twitter",
  "/api/post/scheduled",
  "/api/test",
  "/api/callback/github",
  "/api/webhooks/(.*)",
  // "/api/webhooks/user",
  // "/api/webhooks/subscription",
  // "/api/webhooks/invite",
  // "/api/success/youtube-post",
]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
