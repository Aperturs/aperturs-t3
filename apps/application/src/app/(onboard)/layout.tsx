import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

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

  return <>{children}</>;
}
