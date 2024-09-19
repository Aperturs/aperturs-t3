/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;
