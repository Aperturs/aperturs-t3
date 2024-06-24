import "@aperturs/ui/globals.css";
import "./globals.css";

import type { Metadata } from "next";

import { NavBar } from "~/components/navbar";

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
      <body className="dark">
        <div className="bg-black">
          <div className="w-full  bg-opacity-20 p-3 fixed backdrop-blur-lg backdrop-filter border-b">
            <NavBar />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
