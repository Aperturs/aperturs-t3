import type React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { ModeToggle } from "~/components/layouts/theme-toggle";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (auth().sessionClaims?.metadata.onboardingComplete === true) {
    redirect("/dashboard");
  }

  return (
    <div className="relative h-fit min-h-screen w-full">
      {children}
      <div className="absolute bottom-0 right-0">
        <ModeToggle />
      </div>
    </div>
  );
}
