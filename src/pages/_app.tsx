import { AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@material-tailwind/react";
import { Analytics } from '@vercel/analytics/react';


import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/calendar.css"
import { ClerkProvider } from "@clerk/nextjs";
import { NextPage } from "next";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { Router } from "next/router";
import LogoLoad from "~/components/custom/loading/logoLoad";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp: AppType<{ session: Session | null }> = ({Component,pageProps: { session, ...pageProps },}:AppPropsWithLayout) => {

  const getLayout = Component.getLayout ?? ((page) => page)
  const [loading, setLoading] = useState(false);

      useEffect(() => {
        const start = () => setLoading(true);
        const end = () => setLoading(false);

        Router.events.on('routeChangeStart', start);
        Router.events.on('routeChangeComplete', end);
        Router.events.on('routeChangeError', end);

        return () => {
          Router.events.off('routeChangeStart', start);
          Router.events.off('routeChangeComplete', end);
          Router.events.off('routeChangeError', end);
        };
      }, []);

  function Comp(){
    return(
      <>
      {loading? <LogoLoad size="24"/> : <Component {...pageProps} />}
      </>
    )
  }    

  return (
    <SessionProvider session={session}>
      <ClerkProvider {...pageProps}>
      <ThemeProvider>
        <Toaster position="top-left" reverseOrder={false} />
       { getLayout(
        <Comp />
      //  <Component {...pageProps} />
       ) }
       <Analytics />
      </ThemeProvider>
      </ClerkProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
