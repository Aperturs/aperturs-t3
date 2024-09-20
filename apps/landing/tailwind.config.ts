import type { Config } from "tailwindcss";

import baseConfig from "@aperturs/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  theme: {
    extend: {
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        shimmer: "shimmer 2s linear infinite",
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
        "low": "var(--shadow-elevation-low)",
        "mid": "var(--shadow-elevation-medium)",
        "high": "var(--shadow-elevation-high)",
      },
      fontFamily: {
        caveat: ["var(--font-caveat)"],
      },
      keyframes: {
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
    },
  },
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
