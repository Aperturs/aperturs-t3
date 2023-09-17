// Set the paths that don't require the user to be signed in
// const publicPaths = [
//   "/login*",
//   "/signup*",
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

//   if (!userId) {
//     // redirect the users to /pages/sign-in/[[...index]].ts

//     const signInUrl = new URL("/login", request.url);
//     signInUrl.searchParams.set("redirect_url", request.url);
//     return NextResponse.redirect(signInUrl);
//   }
//   return NextResponse.next();
// });

// export const config = {
//   matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
// };

import { authMiddleware } from "@clerk/nextjs/server";
console.log("something");

export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: [
    "/login",
    "/signup",
    "/api/webhooks/user",
    "/api/callback/",
    "/api/lens/upload",
    "/api/post/schedule",
  ],
  // debug: process.env.NODE_ENV === "development",  
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
