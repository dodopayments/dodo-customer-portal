"use client";

import { Button } from "./ui/button";
import ThemeSwitch from "./ui/dodo/ThemeSwitch";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useLogout } from "@/hooks/use-logout";

export default function NavbarTwo() {
    const { resolvedTheme } = useTheme();
    const { handleLogout, isLoggingOut } = useLogout({ hasBusinessToken: true });
  
    return (
    <div className="flex flex-row justify-between">
    <div className="flex flex-row items-center justify-center gap-2">
      {resolvedTheme === "light" ? (
        <Image src="/images/brand-assets/logo/logo-name-light.svg" alt="logo" width={150} height={150} suppressHydrationWarning />
      ) : (
        <Image src="/images/brand-assets/logo/logo-name-dark.svg" alt="logo" width={150} height={150} suppressHydrationWarning />
      )}
    </div>
    <div className="flex flex-row gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <ThemeSwitch />
        <Button
          variant={"secondary"}
          className="text-left w-full"
          onClick={handleLogout}
          loading={isLoggingOut}
        >
          Log out
        </Button>
      </div>
    </div>
  </div>
  );
}