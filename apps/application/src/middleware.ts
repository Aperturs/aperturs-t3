import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/post/scheduled",
  "/api/callback/(.*)",
  "/api/webhooks/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // "/api/webhooks/user",
  // "/api/webhooks/subscription",
  // "/api/webhooks/invite",
  // "/api/success/youtube-post",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

const supportOnboardingRoute = createRouteMatcher([
  "/socials(.*)",
  "/api/(.*)",
  "/api/callback/(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();

  console.log(req.url, isPublicRoute(req), "outside");

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    console.log(req.url, "not signed in");
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboading route to complete onboarding
  if (
    userId &&
    !sessionClaims?.metadata?.onboardingComplete &&
    !isOnboardingRoute(req) &&
    !supportOnboardingRoute(req) &&
    !isPublicRoute(req)
  ) {
    console.log(req.url, "req.url");
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(req)) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
