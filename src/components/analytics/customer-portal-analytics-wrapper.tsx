"use client";

import { useBusiness } from "@/hooks/use-business";
import { AnalyticsProvider } from "@/components/analytics";

interface CustomerPortalAnalyticsWrapperProps {
  children: React.ReactNode;
}

export function CustomerPortalAnalyticsWrapper({
  children,
}: CustomerPortalAnalyticsWrapperProps) {
  const { business } = useBusiness();

  // Extract tracking config from business data
  const tracking = business?.tracking;
  const hasTracking =
    tracking?.google_tag_manager_id || tracking?.google_analytics_id;

  // If no tracking configured or still loading, just render children
  if (!hasTracking || !tracking) {
    return <>{children}</>;
  }

  return (
    <AnalyticsProvider
      config={{
        googleTagManagerId: tracking.google_tag_manager_id,
        googleAnalyticsId: tracking.google_analytics_id,
      }}
    >
      {children}
    </AnalyticsProvider>
  );
}
