import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/admin/products/*/images",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.etsystatic.com",
      },
    ],
  },
};

export default nextConfig;
