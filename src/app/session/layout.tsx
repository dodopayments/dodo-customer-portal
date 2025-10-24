import React from "react";
import Navbar from "@/components/navbar";
import NextTopLoader from "nextjs-toploader";
import FooterPill from "@/components/footer-pill";

const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
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
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
      <FooterPill align="end" />
    </div>
  );
};

export default Dashboardlayout;
