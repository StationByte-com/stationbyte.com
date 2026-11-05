import type { NextConfig } from "next";

// Sent with every response. No CSP yet: Next's inline runtime scripts would need nonces, a separate change.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the project root; a stray lockfile higher up the disk otherwise makes Next guess wrong.
  turbopack: { root: process.cwd() },
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
