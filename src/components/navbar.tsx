"use client";

import { useEffect, useState, useRef } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";
import ThemeSwitch from "./ui/dodo/ThemeSwitch";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ChevronDown, Menu } from "lucide-react";
import { logout } from "@/lib/server-actions";
import { useBusiness } from "@/hooks/use-business";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Head from "next/head";
import { navigation } from "./sidebar/app-sidebar";
import parseError from "@/lib/clientErrorHelper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const BusinessName = ({
  image,
  name,
  hide,
  interactive = false,
}: {
  image?: string;
  name: string;
  hide?: boolean;
  interactive?: boolean;
}) => {
  if (!interactive) {
    return (
      <div className="flex items-center justify-center gap-2">
        {image ? (
          <Avatar className="w-7 h-7">
            <AvatarImage src={image} />
            <AvatarFallback className="text-xs" name={name} />
          </Avatar>
        ) : (
          <div className="rounded-full object-cover object-center bg-bg-secondary w-8 h-8" />
        )}
        <span
          className={cn(
            "text-text-primary font-display text-xl font-semibold",
            hide && "md:block hidden"
          )}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-border-secondary px-3 py-2"
        >
          {image ? (
            <Avatar className="w-7 h-7">
              <AvatarImage src={image} />
              <AvatarFallback className="text-xs" name={name} />
            </Avatar>
          ) : (
            <div className="rounded-full object-cover object-center bg-bg-secondary w-8 h-8" />
          )}
          <span
            className={cn(
              "text-text-primary font-display text-xl font-semibold",
              hide && "md:block hidden"
            )}
          >
            {name}
          </span>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => {
            window.location.href = "/businesses";
          }}
        >
          View all businesses
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getPostLogoutRedirect = (options: {
  hasBusinessToken?: boolean;
  businessId?: string;
}) => {
  const { hasBusinessToken, businessId } = options;

  if (hasBusinessToken) {
    return "/businesses";
  }
  if (businessId) {
    return `/login/${businessId}`;
  }
  return "/";
};

export default function Navbar({
  hasBusinessToken = false,
}: {
  hasBusinessToken?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { business: businessData } = useBusiness();
  const router = useRouter();
  const businessIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (businessData?.business_id) {
      businessIdRef.current = businessData.business_id;
    }
  }, [businessData?.business_id]);

  useEffect(() => {
    if (businessData?.name) {
      document.title = `${businessData.name} - DodoPayments`;
    }
  }, [businessData?.name]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      const businessId = businessData?.business_id || businessIdRef.current;

      const result = await logout();
      if (result.success) {
        const redirectTo = getPostLogoutRedirect({
          hasBusinessToken,
          businessId,
        });
        router.push(redirectTo);
      }
    } catch (error) {
      parseError(error, "Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {businessData?.name
            ? `${businessData.name} - DodoPayments`
            : "DodoPayments"}
        </title>
      </Head>
      <nav
        className={`md:hidden sticky top-0 z-50 bg-bg-primary  border-border-secondary border-b`}
      >
        <div
          className={`relative flex items-center  gap-6 justify-between py-4 pb-3 md:px-12 px-4 mt-2`}
        >
          <div className="flex items-center gap-6">
            <BusinessName
              image={businessData?.logo}
              hide
              name={businessData?.name ?? ""}
              interactive={hasBusinessToken}
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <div>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] px-2 sm:w-[400px]"
                >
                  <SheetTitle className="hidden">
                    Navigation Side Panel for Mobile
                  </SheetTitle>
                  <div className="flex flex-col h-full">
                    <div className="px-4 py-6 w-full flex justify-start">
                      <BusinessName
                        image={businessData?.logo}
                        name={businessData?.name ?? ""}
                        interactive={hasBusinessToken}
                      />
                    </div>
                    <MobilePills closeSheet={() => setIsOpen(false)} />
                    <div className="mt-auto p-4">
                      <Button
                        variant={"secondary"}
                        className="text-left w-full"
                        disabled={isLoggingOut}
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        {isLoggingOut ? "Logging out..." : "Log out"}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

const MobilePills = ({ closeSheet }: { closeSheet: () => void }) => {
  const params = useParams();
  const token = params.token;
  const pathname = usePathname();

  const getActiveItem = () => {
    return navigation.find((item) => {
      if (item.activeCheck) {
        return item.activeCheck.some((check) => pathname.includes(check));
      }
      return pathname.includes(item.path);
    });
  };

  const activeItem = getActiveItem();

  return (
    <div className="flex flex-col gap-2 px-4">
      {navigation.map((item) => {
        const isActive = activeItem?.path === item.path;
        const href = token
          ? `/session/${token}${item.path.replace("/session", "")}`
          : item.path;

        return (
          <Link
            key={item.path}
            href={href}
            className={cn(
              "p-2 relative duration-300 font-display text-sm font-normal tracking-wide transition-colors rounded-md",
              isActive
                ? "bg-button-secondary-bg text-button-secondary-text"
                : "text-text-tertiary hover:text-button-secondary-text hover:bg-button-secondary-bg/50"
            )}
            onClick={() => {
              closeSheet();
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};
