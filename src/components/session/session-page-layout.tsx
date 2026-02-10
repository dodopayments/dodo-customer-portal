"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/hooks/use-business";
import { useLogout } from "@/hooks/use-logout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, LogOut, Moon, Sun } from "lucide-react";
import { LeftPanel } from "./overview/left-panel";
import { useTheme } from "next-themes";

interface SessionPageLayoutProps {
  children: React.ReactNode;
  /** Optional page title */
  title?: string;
  /** Destination for the back button */
  backHref?: string;
  /** Whether to display the back button */
  showBack?: boolean;
  /** Component(s) to render in the header action area */
  headerActions?: React.ReactNode;
}

export function SessionPageLayout({
  children,
  title,
  backHref = "/session/overview",
  showBack = true,
  headerActions,
}: SessionPageLayoutProps) {
  const router = useRouter();
  const { business } = useBusiness();
  const { handleLogout, isLoggingOut } = useLogout();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };


  const toggleTheme = () => {
    if (!(document as any).startViewTransition) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    (document as any).startViewTransition(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    });
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bg-primary">
      <LeftPanel />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 bg-bg-primary border-b border-border-secondary">
          <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4">
            <div className="flex items-center gap-3">
              {business?.logo ? (
                <Avatar className="w-8 h-8 border border-border-secondary bg-bg-secondary">
                  <AvatarImage src={business.logo} alt={business.name || "Business"} className="object-contain" />
                  <AvatarFallback className="text-sm bg-[#0a4ceb] text-white" name={business.name || "Business"} singleInitials>
                    {business.name?.charAt(0) || "B"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0a4ceb] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {business?.name?.charAt(0) || "B"}
                  </span>
                </div>
              )}
              <span className="text-lg font-display font-semibold text-text-primary">
                {business?.name || "Business"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 border border-border-secondary rounded-lg hover:bg-bg-secondary"
                title={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : undefined}
              >
                {mounted && isDark ? (
                  <Sun className="w-5 h-5 text-text-primary" />
                ) : (
                  <Moon className="w-5 h-5 text-text-primary" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-9 w-9 border border-border-secondary rounded-lg hover:bg-bg-secondary"
                title="Log out"
              >
                <LogOut className="w-5 h-5 text-text-primary" />
              </Button>
            </div>
          </div>
        </header>

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
