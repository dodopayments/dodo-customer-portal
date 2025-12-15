"use client";

import { Button } from "./ui/button";
import ThemeSwitch from "./ui/dodo/ThemeSwitch";
import Image from "next/image";
import { useTheme } from "next-themes";
import { tokenHelper } from "@/lib/token-helper";
import { redirect } from "next/navigation";

export default function NavbarTwo() {
    const { resolvedTheme } = useTheme();
  
    return (
    <div className="flex flex-row justify-between">
    <div className="flex flex-row items-center justify-center gap-2">
      <Image src={resolvedTheme === "dark" ? "/images/brand-assets/logo/logo-name-dark.svg" : "/images/brand-assets/logo/logo-name-light.svg"} alt="logo" width={150} height={150} />
    </div>
    <div className="flex flex-row gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <ThemeSwitch />
        <Button
          variant={"secondary"}
          className="text-left w-full"
          onClick={() => {
            async function logout() {
              const success = await tokenHelper.logout();
              if (success) {
                redirect("/");
              }
            }
            logout();
          }} 
        >
          Log out
        </Button>
      </div>
    </div>
  </div>
  );
}