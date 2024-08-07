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
    <div className="relative h-[100dvh] w-full bg-black">
      <section className="relative z-10 h-full">{children}</section>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
    </div>
  );
}
