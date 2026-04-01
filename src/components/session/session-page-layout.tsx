"use client";

import React from "react";
import { LeftPanel } from "./overview/left-panel";
import { SessionHeader } from "./session-header";

interface SessionPageLayoutProps {
  children: React.ReactNode;
  /** Component(s) to render in the header action area */
  headerActions?: React.ReactNode;
}

export function SessionPageLayout({
  children,
  headerActions,
}: SessionPageLayoutProps) {

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-bg-primary">
      <LeftPanel />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SessionHeader showBusinessSwitcher />

        {/* Content Area */}
         <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-8 overflow-y-auto">
           <div className="max-w-5xl">
             {headerActions && (
               <div className="flex items-center justify-end mb-6">
                 <div className="flex items-center gap-2">
                   {headerActions}
                 </div>
               </div>
             )}

             {children}
           </div>
         </div>
      </div>
    </div>
  );
}
