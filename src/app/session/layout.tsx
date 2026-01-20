import React from "react";
import NextTopLoader from "nextjs-toploader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Navbar from "@/components/navbar";
import { getBusinessToken } from "@/lib/server-actions";

const Dashboardlayout = async ({ children }: { children: React.ReactNode }) => {
  const businessToken = await getBusinessToken();
  const hasBusinessToken = !!businessToken;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <SidebarProvider className="h-full min-h-0">
        <NextTopLoader
          color="#0a4ceb"
          initialPosition={0.25}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease-out"
          speed={200}
          shadow="0"
          zIndex={1600}
          showAtBottom={false}
        />
        <AppSidebar hasBusinessToken={hasBusinessToken} />

        <main className="flex-1 min-h-0 overflow-y-auto">
          <Navbar hasBusinessToken={hasBusinessToken} />
          <div className="border-t mt-6 m-3 border-border-secondary rounded-t-2xl shadow-[0px_-3px_20px_0px_var(--bg-secondary),-3px_0px_20px_0px_var(--bg-secondary),3px_0px_20px_0px_var(--bg-secondary)] min-h-[calc(100vh-3rem)]">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Dashboardlayout;
