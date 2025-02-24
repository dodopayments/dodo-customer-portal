"use client";

import { ReactNode, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export function CSPostHogProvider({ children }: { children: ReactNode }) {

  useEffect(() => {
    
    if (typeof window !== "undefined" && !posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
        ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST!,
        person_profiles: "identified_only",
      });
      posthog.__loaded = true;
    }
  }, []);

  // useEffect(() => {
  //   if (auth.email) {
  //     posthog.identify(auth.email, { name: auth.userName });
  //   }
  // }, [auth.email, auth.userName]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
