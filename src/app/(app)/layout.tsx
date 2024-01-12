"use client";

import { ThemeProvider } from "@material-tailwind/react";
import { Layout } from "~/components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
}
