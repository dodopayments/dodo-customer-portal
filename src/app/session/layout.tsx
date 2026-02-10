import React from "react";
import NextTopLoader from "nextjs-toploader";
import { BusinessProvider } from "@/contexts/business-context";
import { fetchBusiness, getBusinessToken } from "@/lib/server-actions";
import { CustomerPortalAnalyticsWrapper } from "@/components/analytics/customer-portal-analytics-wrapper";

const Dashboardlayout = async ({ children }: { children: React.ReactNode }) => {
  let businessData = null;
  let hasBusinessToken = false;
  try {
    businessData = await fetchBusiness();
    const businessToken = await getBusinessToken();
    hasBusinessToken = !!businessToken;
  } catch (error) {
    console.error("Failed to fetch business data:", error);
  }

  return (
    <BusinessProvider initialBusiness={businessData} hasBusinessToken={hasBusinessToken}>
      <CustomerPortalAnalyticsWrapper>
        <div className="flex flex-col h-screen w-full bg-bg-primary">
          <NextTopLoader
            color="#0a4ceb"
            initialPosition={0.25}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease-out"
            speed={200}
            shadow="0"
            zIndex={1600}
            showAtBottom={false}
          />
          <main className="flex-1 min-h-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </CustomerPortalAnalyticsWrapper>
    </BusinessProvider>
  );
};

export default Dashboardlayout;
