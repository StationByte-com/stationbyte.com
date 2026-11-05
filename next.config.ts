import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Typed message keys come from the English source; every other language must match it (npm run i18n:check).
const withNextIntl = createNextIntlPlugin({ experimental: { createMessagesDeclaration: "./messages/en.json" } });

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
  // The root layout is app/[locale]/layout.tsx; URLs outside every route get app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  // Self-contained server for the Docker image (Dockerfile.production): config is baked in at build time.
  output: "standalone",
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
  // English has no prefix; /en URLs are permanent duplicates of the unprefixed ones.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
