"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { usePathname } from "next/navigation";

const routes = ["light-only"];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname();
  const forcedThemeFromPathname = routes.some((route) =>
    pathname.startsWith(route)
  )
    ? "light"
    : undefined;

  return (
    <NextThemesProvider forcedTheme={forcedThemeFromPathname} {...props}>
      {children}
    </NextThemesProvider>
  );
}
