import "@aperturs/ui/globals.css";
import "~/styles/calendar.css";

import { Lato } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";
import AuthProvider from "./_provider/auth-provider";
import { ThemeProvider } from "./_provider/theme-provider";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

const lato = Lato({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lato",
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
      <head>
        <Script id="lemonSqueezyAffiliateConfig">{`window.lemonSqueezyAffiliateConfig = { store: "aperturs" };`}</Script>
        <Script src="https://lmsqueezy.com/affiliate.js" defer></Script>
      </head>
      <body className={`font-sans ${lato.variable}`}>
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
              <>{children}</>
            </TRPCReactProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
