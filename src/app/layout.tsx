import "~/styles/calendar.css";
import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster position="top-left" reverseOrder={false} />
            <TRPCReactProvider cookies={cookies().toString()}>
              {children}
            </TRPCReactProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
