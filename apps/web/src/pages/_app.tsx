import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { type Metadata, type NextPage } from "next";
import { type AppProps, type AppType } from "next/app";
import { Router } from "next/router";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import LogoLoad from "~/components/custom/loading/logoLoad";
import { ThemeProvider } from "~/app/_provider/theme-provider";
import "~/styles/calendar.css";
import "~/styles/globals.css";
import { api } from "~/utils/api";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const metadata: Metadata = {
  title: "Aperturs",
  description: "One Stop Social Media Management Software",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon_light.ico",
        href: "/favicon_light.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon_dark.ico",
        href: "/favicon_dark.ico",
      },
    ],
  },
};

const getFaviconPath = (isDarkMode = false) => {
  return `/favicon_${isDarkMode ? "light" : "dark"}.ico`;
};

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [loading, setLoading] = useState(false);
  const [faviconHref, setFaviconHref] = useState("/favicon_light.ico");

  useEffect(() => {
    // Get current color scheme.
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    // Set favicon initially.
    setFaviconHref(getFaviconPath(matcher.matches));
    // Change favicon if the color scheme changes.
    matcher.onchange = () => setFaviconHref(getFaviconPath(matcher.matches));
  }, [faviconHref]);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  function Comp() {
    return (
      <>{loading ? <LogoLoad size="24" /> : <Component {...pageProps} />}</>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider
        {...pageProps}
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary",
          },
        }}
      >
        <Toaster position="top-left" reverseOrder={false} />

        {getLayout(
          <Comp />,
          //  <Component {...pageProps} />
        )}
        <Analytics />
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
