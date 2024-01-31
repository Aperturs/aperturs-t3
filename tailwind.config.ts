/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 6px 10px rgba(0, 0, 0, 0.1)",
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "0 0 rgb(0, 0 / 0, 0)",
      },
    },
  },
  variants: {
    extend: {
      animation: ["group-hover"],
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          primary: "#132da0",

          secondary: "#e3f2ff",

          accent: "#2d68ff",

          neutral: "#f7f7fc",

          "base-100": "#ffffff",

          info: "#3ABFF8",

          success: "#22c55e",

          warning: "#ffa800",

          error: "#dc2c2b",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require("@tailwindcss/container-queries")],
} satisfies Config);
