import React from "react";
import NextTopLoader from "nextjs-toploader";
import { BusinessProvider } from "@/contexts/business-context";
import SessionThemeWrapper from "@/components/providers/session-theme-wrapper";
import { DemoThemeBridge } from "./demo-theme-bridge";

const DEMO_BUSINESS = {
  business_id: "demo",
  name: "Demo",
  logo: "",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionThemeWrapper>
      <BusinessProvider initialBusiness={DEMO_BUSINESS} hasBusinessToken={false}>
        <div className="flex flex-col h-screen w-full bg-bg-primary">
          <DemoThemeBridge />
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
          <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
        </div>
      </BusinessProvider>
    </SessionThemeWrapper>
  );
}
