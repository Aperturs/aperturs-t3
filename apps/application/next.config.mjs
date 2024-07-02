import { fileURLToPath } from "url";
import _jiti from "jiti";

// const __dirname = dirname(__filename);

const jiti = _jiti(fileURLToPath(import.meta.url));
jiti("./src/env");
jiti("@aperturs/api/env");

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
// !process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
    // ...(process.env.NODE_ENV === "development"
    //   ? { outputFileTracingRoot: path.join(__dirname, "../../") }
    //   : null),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "cdkapertursstack-youtubeuploadsbucketb855ba46-ppocdos2sz5k.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "aperturs-main.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
    ],
  },
  transpilePackages: [
    "@aperturs/api",
    "@aperturs/db",
    "@aperturs/ui",
    "@aperturs/validators",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

// export default MillionLint.next({
//   rsc: true
// })(config);

export default config;
