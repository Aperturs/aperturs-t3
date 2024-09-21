import "@aperturs/ui/globals.css";
import "./globals.css";

import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import NavBar from "~/components/navbar";
import { CSPostHogProvider } from "~/components/providers/posthogs";

export const metadata: Metadata = {
  title: "Aperturs | Social media management for the modern age",
  description:
    "social media management for the modern age, with a focus on privacy and security",
  metadataBase: new URL("https://aperturs.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aperturs.com",
    siteName: "Aperturs",
  },
  twitter: {
    creator: "@swarajbachu",
    description: "social media management for the modern age",
    title: "Aperturs | Social media management for the modern age",
    card: "summary_large_image",
    site: "@theAperturs",
    images: [
      {
        url: "https://aperturs.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Aperturs | Social media management for the modern age",
      },
    ],
  },
};

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={caveat.variable}>
      <Toaster />
      <head>
        <Script id="lemonSqueezyAffiliateConfig">{`window.lemonSqueezyAffiliateConfig = { store: "aperturs" };`}</Script>
        <Script src="https://lmsqueezy.com/affiliate.js" defer></Script>
      </head>
      <body>
        <CSPostHogProvider>
          <div className="flex flex-col items-center bg-background">
            <main className="container flex w-full flex-col items-center">
              <NavBar />
              {children}
            </main>
          </div>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
