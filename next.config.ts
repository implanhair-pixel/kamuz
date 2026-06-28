import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Required for Netlify deployment
  output: "standalone",
};

export default nextConfig;
