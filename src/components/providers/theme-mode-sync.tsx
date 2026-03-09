"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { ThemeMode } from "@/types/theme";

interface ThemeModeSyncProps {
  themeMode?: ThemeMode | null;
}

/**
 * Syncs the business theme_mode (from the API) into next-themes.
 *
 * - "light" / "dark": forces that mode
 * - "system": actively sets system mode (follows OS preference, overrides localStorage)
 * - null/undefined: no-op
 */
export default function ThemeModeSync({ themeMode }: ThemeModeSyncProps) {
  const { setTheme } = useTheme();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (themeMode === "light" || themeMode === "dark" || themeMode === "system") {
      setTheme(themeMode);
    }
  }, [themeMode, setTheme]);

  return null;
}
