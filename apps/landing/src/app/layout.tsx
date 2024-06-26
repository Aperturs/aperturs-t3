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
        <div className="flex flex-col items-center bg-black">
          <div className="fixed flex w-full  justify-center border-b bg-opacity-20 p-3 backdrop-blur-lg backdrop-filter">
            <NavBar />
          </div>
          <div className="max-w-screen-2xl px-5">{children}</div>
        </div>
      </body>
    </html>
  );
}
