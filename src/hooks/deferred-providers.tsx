"use client";

import dynamic from "next/dynamic";

const CSPlausibleProvider = dynamic(
  () =>
    import("@/hooks/plausible-provider").then((m) => m.CSPlausibleProvider),
  { ssr: false }
);

const CSOpenReplayProvider = dynamic(
  () =>
    import("@/hooks/openreplay-provider").then((m) => m.CSOpenReplayProvider),
  { ssr: false }
);

export function DeferredProviders() {
  return (
    <>
      <CSPlausibleProvider />
      <CSOpenReplayProvider />
    </>
  );
}
