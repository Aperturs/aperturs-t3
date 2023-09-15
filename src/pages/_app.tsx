import { ThemeProvider } from "@material-tailwind/react";
import { Analytics } from "@vercel/analytics/react";
import { type AppProps, type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";

import { ClerkProvider } from "@clerk/nextjs";
import { type NextPage } from "next";
import { Router } from "next/router";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import LogoLoad from "~/components/custom/loading/logoLoad";
import Lenswrapper from "~/components/wrappers/lenswrapper";
import "~/styles/calendar.css";
import "~/styles/globals.css";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [loading, setLoading] = useState(false);

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
    <Lenswrapper>
      <ClerkProvider {...pageProps}
      
      appearance={{
        elements: {
         formButtonPrimary: 'bg-primary'
        }
      }}>
        <ThemeProvider>
          <Toaster position="top-left" reverseOrder={false} />
          {getLayout(
            <Comp />
            //  <Component {...pageProps} />
          )}
          <Analytics />
        </ThemeProvider>
      </ClerkProvider>
    </Lenswrapper>
  );
};

export default api.withTRPC(MyApp);
