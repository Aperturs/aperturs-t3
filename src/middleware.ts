// Set the paths that don't require the user to be signed in

import { authMiddleware } from "@clerk/nextjs";

// const publicPaths = [
//   "/sign-in",
//   "/sign-up*",
//   "/api/webhooks/user*",
//   "/api/callback/*",
//   "/api/lens/upload*",
//   "/api/post/schedule*",
//   "/api/userPost.hello",
// ];

// const isPublic = (path: string) => {
//   return publicPaths.find((x) =>
//     path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
//   );
// };

// export default withClerkMiddleware((request: NextRequest) => {
//   if (isPublic(request.nextUrl.pathname)) {
//     return NextResponse.next();
//   }
//   // if the user is not signed in redirect them to the sign in page.
//   const { userId } = getAuth(request);
//   console.log("userId", userId)

//   if (!userId) {
//     // redirect the users to /pages/sign-in/[[...index]].ts

//     const signInUrl = new URL("/sign-in", request.url);
//     signInUrl.searchParams.set("redirect_url", request.url);
//     return NextResponse.redirect(signInUrl);
//   }
//   return NextResponse.next();
// });

// export const config = {
//   matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
// };

export default authMiddleware({

  
  // "/" will be accessible to all users
  publicRoutes: [
    "/login",
    "/signup",
    "/api/webhooks/user",
    "/api/callback/twitter",
    "/api/lens/upload",
    "/api/post/schedule",
    "/api/test"
  ],
  // ignoredRoutes: ["/api/callback/twitter"],
  apiRoutes: [
    "/api/callback(.*)",
    "/api/callback/linkedin",
    "/api/callback/twitter",
  ],
  ignoredRoutes: ["/api/trigger","api/test"],
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
