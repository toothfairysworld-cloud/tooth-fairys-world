import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const isDev = process.env.NODE_ENV !== "production";

/**
 * Security headers — moderate CSP without nonces (Next.js hydration needs
 * inline bootstrap). Production hardening path: nonces via middleware.
 * Dev adds 'unsafe-eval' for React Refresh / HMR.
 *
 * Framing: dev/preview must be embeddable in the sandbox preview iframe
 * (cross-origin), so frame-ancestors/X-Frame-Options are DEV-ONLY relaxed.
 * Production keeps strict anti-clickjacking headers.
 */
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Block being framed by other sites in production; allow in dev so the
  // platform's preview panel iframe can render the running site.
  ...(isDev ? [] : ["frame-ancestors 'self'"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // DEV: omitted entirely — X-Frame-Options even with SAMEORIGIN would block
  // the cross-origin sandbox preview iframe ("refused to connect").
  ...(isDev
    ? []
    : [{ key: "X-Frame-Options", value: "SAMEORIGIN" }]),
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    // Self-hosted files in /public, served optimized as AVIF/WebP by next/image
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1120, 1280, 1536, 1920],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
