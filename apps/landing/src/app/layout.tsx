import "@aperturs/ui/globals.css";
import "./globals.css";

import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Aperturs | Social media management for the modern age",
  description:
    "social media management for the modern age, with a focus on privacy and security",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aperturs.com",
    siteName: "Aperturs",
    images: [
      {
        url: "https://aperturs.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Aperturs | Social media management for the modern age",
      },
    ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
        rel="preload"
        href="Mona-Sans.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      ></link>
      <Toaster />
      <head>
        <Script id="lemonSqueezyAffiliateConfig">{`window.lemonSqueezyAffiliateConfig = { store: "aperturs" };`}</Script>
        <Script src="https://lmsqueezy.com/affiliate.js" defer></Script>
      </head>
      <body className="">
        <div className="flex flex-col items-center bg-slate-50">
          {/* <div className="fixed flex w-full  justify-center border-b bg-opacity-20 p-3 backdrop-blur-lg backdrop-filter">
            <NavBar />
          </div> */}
          <div className="max-w-screen-2xl px-5">{children}</div>
        </div>
      </body>
    </html>
  );
}
