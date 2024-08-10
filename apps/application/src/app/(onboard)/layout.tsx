import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

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
  if (auth().sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  return (
    <div className="relative h-[100dvh] w-full dark:bg-black">
      <section className="relative z-10 h-full">{children}</section>
      <div className="absolute top-0 -z-10 h-full w-full bg-white dark:hidden">
        <div className="absolute  bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px] dark:hidden" />
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 top-0 hidden bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:block"></div> */}
      <div className="absolute  left-0 right-0 top-[-10%] hidden size-[250px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)] dark:block sm:size-[400px] md:size-[600px] lg:size-[1000px]"></div>
    </div>
  );
}
