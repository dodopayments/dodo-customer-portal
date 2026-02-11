"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/hooks/use-business";
import { useLogout } from "@/hooks/use-logout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface SessionHeaderProps {
  showUserMenu?: boolean;
  user?: { name: string; email: string } | null;
  showBusinessSwitcher?: boolean;
}

function BusinessIdentity({
  showBusinessSwitcher,
}: {
  showBusinessSwitcher: boolean;
}) {
  const router = useRouter();
  const { business, hasBusinessToken } = useBusiness();
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);

  const content = (
    <div className="flex items-center gap-3">
      {business?.logo ? (
        <Avatar className="w-8 h-8 border border-border-secondary bg-bg-secondary">
          <AvatarImage
            src={business.logo}
            alt={business?.name || "Business"}
            className="object-contain"
          />
          <AvatarFallback
            className="text-sm bg-[#0a4ceb] text-white"
            name={business?.name || "Business"}
            singleInitials
          />
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
      {showBusinessSwitcher && hasBusinessToken ? (
        isBusinessMenuOpen ? (
          <ChevronUp className="w-4 h-4 text-text-secondary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        )
      ) : null}
    </div>
  );

  if (!showBusinessSwitcher || !hasBusinessToken) {
    return content;
  }

  return (
    <DropdownMenu onOpenChange={setIsBusinessMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          {content}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          onClick={() => router.push("/businesses")}
          className="cursor-pointer py-3"
        >
          View all businesses
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SessionHeader({
  showUserMenu = false,
  user,
  showBusinessSwitcher = false,
}: SessionHeaderProps) {
  const { business } = useBusiness();
  const { handleLogout, isLoggingOut } = useLogout();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (business?.name) {
      document.title = `${business.name} - DodoPayments`;
    }
  }, [business?.name]);

  const toggleTheme = () => {
    if (!(document as Document).startViewTransition) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    (document as Document).startViewTransition(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    });
  };

  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-lg border-b border-border-secondary">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4">
        <BusinessIdentity showBusinessSwitcher={showBusinessSwitcher} />

        {showUserMenu ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="w-10 h-10 hover:bg-bg-secondary transition-colors"
              >
                <User className="w-5 h-5 text-text-secondary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-3">
                <p className="text-sm font-medium text-text-primary">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-text-secondary">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer py-3">
                {mounted && isDark ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Switch to light mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Switch to dark mode
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer py-3"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 border border-border-secondary rounded-lg hover:bg-bg-secondary"
              title={
                mounted
                  ? isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                  : undefined
              }
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
        )}
      </div>
    </header>
  );
}
