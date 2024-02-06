import "~/styles/globals.css";
import "~/styles/calendar.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-left" reverseOrder={false} />
          <ClerkProvider
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary",
              },
              baseTheme: dark,
            }}
          >
            <TRPCReactProvider cookies={cookies().toString()}>
              {children}
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
