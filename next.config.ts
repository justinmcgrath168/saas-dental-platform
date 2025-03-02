import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["dentalhub.com", "localhost"],
  },
  experimental: {
    serverComponentsExternalPackages: ["bcrypt"],
  },
};

export default nextConfig;
