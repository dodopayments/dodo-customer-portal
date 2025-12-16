"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/hooks/use-business";
import { useEffect, useState, useRef } from "react";
import { logout } from "@/lib/server-actions";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import ThemeSwitch from "../ui/dodo/ThemeSwitch";
import parseError from "@/lib/clientErrorHelper";

const BusinessName = ({
  image,
  name,
  hide,
}: {
  image?: string;
  name: string;
  hide?: boolean;
}) => {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer rounded-lg p-2 border border-border-secondary"
      onClick={() => (window.location.href = "/")}
    >
      {image ? (
        <Avatar className="w-7 h-7 aspect-square">
          <AvatarImage src={image} />
          <AvatarFallback className="text-xs" name={name} />
        </Avatar>
      ) : (
        <div className="object-cover object-center bg-bg-secondary w-8 h-8 aspect-square" />
      )}
      <span
        className={cn(
          "text-text-primary font-display font-semibold text-xl leading-5 tracking-normal",
          hide && "md:block hidden"
        )}
        style={{ leadingTrim: "cap-height" } as React.CSSProperties}
      >
        {name}
      </span>
    </div>
  );
};

export const navigation = [
  {
    label: "Manage Subscriptions",
    path: "/session/subscriptions",
    activeCheck: ["/session/subscriptions"],
  },
  {
    label: "Orders",
    path: "/session/orders",
    activeCheck: ["/session/orders"],
  },
  { label: "Payment Methods", path: "/session/payment-methods" },
  { label: "Profile & Wallets", path: "/session/profile" },
];

export function AppSidebar() {
  const { business: businessData } = useBusiness();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
        if (businessId) {
          router.push(`/login/${businessId}`);
        } else {
          router.push("/businesses");
        }
      }
    } catch (error) {
      parseError(error, "Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar className="p-6 px-4 border-none">
      <SidebarHeader>
        <BusinessName
          image={businessData?.logo}
          name={businessData?.name ?? ""}
          hide={false}
        />
      </SidebarHeader>
      <SidebarContent className="text-left mt-5">
        <SidebarGroup className="text-left gap-2">
          {navigation.map(({ label, path, activeCheck }) => {
            const isActive = activeCheck
              ? activeCheck.some((check) => pathname.includes(check))
              : pathname.includes(path);

            return (
              <Button
                key={path}
                align="left"
                variant={isActive ? "secondary" : "ghost"}
                className="text-left text-text-secondary font-display font-normal text-sm leading-5 tracking-normal"
                style={{ leadingTrim: "cap-height" } as React.CSSProperties}
                onClick={() => router.push(path)}
              >
                {label}
              </Button>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="self-stretch">
        <Link
          href="https://dodopayments.com"
          target="_blank"
          className="flex flex-row items-center gap-1.5 w-[165px] h-4 mb-2 mx-auto"
        >
          <Image
            src="/images/brand-assets/logo/logo.svg"
            alt="logo"
            width={16}
            height={16}
          />
          <p className="font-display text-nowrap font-medium text-xs text-text-primary">
            Powered by Dodo Payments
          </p>
        </Link>
        <Separator />
        <div className="flex flex-row items-center justify-center gap-2">
          <ThemeSwitch />
          <Button
            variant={"secondary"}
            className="text-left w-full"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
