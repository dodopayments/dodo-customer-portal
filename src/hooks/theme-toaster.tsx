"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export default function ThemeToaster() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  return (
    <Toaster
      position="top-right"
      richColors
      theme={
        pathname.includes("login") ||
        pathname.includes("forgot-password") ||
        pathname.includes("signup") ||
        pathname.includes("reset-password")
          ? "dark"
          : (resolvedTheme as "light" | "dark" | "system")
      }
    />
  );
}
