import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stationbyte.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
