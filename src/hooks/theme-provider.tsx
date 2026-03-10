"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { usePathname } from "next/navigation";
import type { ThemeMode } from "@/types/theme";

const routes = ["/login"];

interface ExtendedThemeProvider extends ThemeProviderProps {
  themeMode?: ThemeMode | null;
}

export function ThemeProvider({
  children,
  themeMode,
  ...props
}: ExtendedThemeProvider) {
  const pathname = usePathname();

  let forcedTheme: string | undefined;
  if (themeMode === "light" || themeMode === "dark") {
    forcedTheme = themeMode;
  } else if (routes.some((route) => pathname.startsWith(route))) {
    forcedTheme = "system";
  }

  return (
    <NextThemesProvider forcedTheme={forcedTheme} {...props}>
      {children}
    </NextThemesProvider>
  );
}
