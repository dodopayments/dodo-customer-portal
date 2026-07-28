"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useBusiness } from "@/contexts/business-context";
import { syncThemeModeCookie } from "@/lib/theme-actions";
import type { ThemeMode } from "@/types/theme";

const VALID: ReadonlyArray<ThemeMode> = ["light", "dark", "system"];

function normalize(value: unknown): ThemeMode | null {
  return VALID.includes(value as ThemeMode) ? (value as ThemeMode) : null;
}

/**
 * Keeps the client-side theme aligned with the merchant's current
 * business.theme_mode. Refreshes the server-side theme_mode cookie when it
 * drifts so the root layout's forcedTheme is updated on the next render.
 */
export function ThemeSync() {
  const { business } = useBusiness();
  const { setTheme } = useTheme();
  const router = useRouter();
  const lastApplied = useRef<ThemeMode | null | undefined>(undefined);

  useEffect(() => {
    const desired = normalize(business?.theme_mode);
    if (lastApplied.current === desired) return;
    lastApplied.current = desired;

    if (desired) setTheme(desired);

    syncThemeModeCookie(desired).then(({ changed }) => {
      if (changed) router.refresh();
    });
  }, [business?.theme_mode, setTheme, router]);

  return null;
}
