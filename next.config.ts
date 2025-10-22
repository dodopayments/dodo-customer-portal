import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dodo-public-sandbox.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dodo-public-live.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "dodo-backend-internal.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "prod-dodo-backend-internal.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "prod-dodo-backend-live-mode.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "prod-dodo-backend-test-mode.s3.ap-south-1.amazonaws.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' dodopayments.com https://dodopayments.com *.dodopayments.com https://*.dodopayments.com;",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

const sentryConfig = {
  org: "dodopayments",
  project: process.env.NEXT_PUBLIC_SENTRY_PROJECT_NAME,
  sentryUrl: "https://sentry.dodopayments.tech/",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
};

const config =
  process.env.NODE_ENV === "production"
    ? withSentryConfig(withNextIntl(nextConfig), sentryConfig)
    : withNextIntl(nextConfig);

export default config;