"use client";

import { Layout } from "~/components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ThemeProvider>
    <Layout>{children}</Layout>
    // </ThemeProvider>
  );
}
