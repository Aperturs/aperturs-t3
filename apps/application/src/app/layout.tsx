import "@aperturs/ui/globals.css";
import "~/styles/calendar.css";

import { Inter } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";

import ModalProvider from "~/components/custom/modals/modal-provider";
import { TRPCReactProvider } from "~/trpc/react";
import AuthProvider from "./_provider/auth-provider";
import { ThemeProvider } from "./_provider/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Aperturs",
  description: "One Stop Social Media Management Software",
  icons: [{ rel: "icon", url: "/favicon_dark.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <SpeedInsights />
        <Script
          src="https://app.lemonsqueezy.com/js/lemon.js"
          strategy="beforeInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster position="top-left" reverseOrder={false} />
            <TRPCReactProvider>
              <ModalProvider>{children}</ModalProvider>
            </TRPCReactProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
