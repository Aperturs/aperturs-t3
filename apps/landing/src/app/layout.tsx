import type { Metadata } from "next";
import "@aperturs/ui/globals.css";

import Navbar from "~/components/navbar";

import "./globals.css";

// const mona = localFont({
//   src: 'mona-sans.woff2',
//   display: 'swap',
// })

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
          {children}
        </div>
      </body>
    </html>
  );
}
