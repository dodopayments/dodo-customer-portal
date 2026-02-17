"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LeftPanel } from "./overview/left-panel";
import { SessionHeader } from "./session-header";

interface SessionPageLayoutProps {
  children: React.ReactNode;
  /** Destination for the back button */
  backHref?: string;
  /** Whether to display the back button */
  showBack?: boolean;
  /** Component(s) to render in the header action area */
  headerActions?: React.ReactNode;
}

export function SessionPageLayout({
  children,
  backHref = "/session/overview",
  showBack = true,
  headerActions,
}: SessionPageLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-bg-primary">
      <LeftPanel />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SessionHeader showBusinessSwitcher showUserMenu={false} />

        {/* Content Area */}
        <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-8 overflow-y-auto">
          <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              {showBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-10 w-10 rounded-md bg-bg-secondary"
                >
                  <ArrowLeft className="w-5 h-5 text-text-secondary" />
                </Button>
              )}
              {!showBack && <div />}

              {headerActions && (
                <div className="flex items-center gap-2">
                  {headerActions}
                </div>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
