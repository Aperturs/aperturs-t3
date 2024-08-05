import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/callback/twitter",
  "/api/post/scheduled",
  "/api/test",
  "/api/callback/github",
  "/api/webhooks/(.*)",
  '/sign-in(.*)',
  '/sign-up(.*)',
  // "/api/webhooks/user",
  // "/api/webhooks/subscription",
  // "/api/webhooks/invite",
  // "/api/success/youtube-post",
]);

export default clerkMiddleware((auth, request) => {
  if(!isPublicRoute(request)) {
    auth().protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
