import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ahu-automation",
        destination: "/applications/ahu-automation",
        permanent: true,
      },
      {
        source: "/hvac-automation",
        destination: "/applications/hvac-automation",
        permanent: true,
      },
    ];
  },
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
