import { Button } from "@aperturs/ui/button";

import { ModeToggle } from "~/components/layouts/theme-toggle";
import SignOutButton from "./sign-out";

const steps = [
  {
    id: 1,
    url: "/onboarding",
  },
  {
    id: 2,
    url: "/onboarding/add-social",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if a user has completed onboarding
  // If yes, redirect them to /dashboard

  return (
    <div className="relative flex min-h-screen w-full flex-col  dark:bg-black">
      <section className="relative z-10 h-full  w-full flex-1">
        {children}
      </section>
      <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px] dark:hidden " />
      {/* <div className="absolute bottom-0 left-0 right-0 top-0 hidden bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:block"></div> */}
      <div className="absolute  left-0 right-0 top-[-10%] hidden  size-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_200px,#fbfbfb36,#000)] dark:block"></div>
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        <SignOutButton />
        <ModeToggle />
      </div>
    </div>
  );
}
