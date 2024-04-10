import "@aperturs/ui/globals.css";
import "./globals.css";

import type { Metadata } from "next";
import Navbar from "~/components/navbar";

export const metadata: Metadata = {
  title: "Aperturs | Social media management for the modern age",
  description:
    "social media management for the modern age, with a focus on privacy and security",
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
      <body>
        <div className="bg-black">
          <Navbar />
          <div className="pt-1">
            <div className="rounded-t-[40px] bg-white">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
