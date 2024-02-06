"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  console.log(theme, "theme");
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary",
        },
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
