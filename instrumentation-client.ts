// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// Note: on Next.js 16 (Turbopack) the client config MUST live here, not in
// `sentry.client.config.ts` (Turbopack does not load that file).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment:
    process.env.NODE_ENV === "development" ? "development" : "production",

  // Attach user context (IP, request headers) to events.
  sendDefaultPii: true,

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // 100% in dev, 10% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Filter out known benign errors
  ignoreErrors: [
    // React/Next.js hydration errors
    "Hydration failed because the initial UI does not match",
    "Text content did not match",
    "Expected server HTML to contain",
    "There was an error while hydrating",
    "There was a hydration error",
    // OpenReplay errors (DoNotTrack or unsupported browser)
    "Browser doesn't support required api",
    "doNotTrack",
  ],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

// Required by the Sentry Next.js SDK (v9+) to instrument client-side
// navigations. Without this export, App Router navigation spans are not captured.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
