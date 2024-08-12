import type React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (auth().sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  return children;
}
