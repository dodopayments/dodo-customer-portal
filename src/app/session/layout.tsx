import React from "react";
import NextTopLoader from "nextjs-toploader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <SidebarProvider>
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
        <AppSidebar />
        {/* <Navbar /> */}
        <main className="flex-1 overflow-y-auto pt-6 pl-3">
          <div className="h-full border-l border-t border-border-secondary rounded-tl-2xl shadow-[-3px_-3px_20px_0px_var(--bg-secondary)]">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Dashboardlayout;
