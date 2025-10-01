import {withSentryConfig} from "@sentry/nextjs";
import type { NextConfig } from "next";
import lingoCompiler from "lingo.dev/compiler";

const withLingo = lingoCompiler.next({
  sourceRoot: "src/app",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de", "it"],
  rsc: true,
  useDirective: false,
  debug: false,
  models: "lingo.dev",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  /* config options here */
};

// Keep Sentry wrapping; apply Lingo around nextConfig
export default withSentryConfig(withSentryConfig(withLingo(nextConfig), {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "dodo-payments",
project: process.env.NEXT_PUBLIC_SENTRY_PROJECT_NAME,

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Automatically annotate React components to show their full name in breadcrumbs and session replay
reactComponentAnnotation: {
enabled: true,
},

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
}));