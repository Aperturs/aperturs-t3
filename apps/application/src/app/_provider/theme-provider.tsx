"use client";

import type { ThemeProviderProps } from "next-themes/dist/types";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ProgressBar
        height="4px"
        color="#3C5CE8"
        // options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </NextThemesProvider>
  );
}
