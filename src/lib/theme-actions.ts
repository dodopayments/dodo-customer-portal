"use server";

import { cookies } from "next/headers";
import type { ThemeMode } from "@/types/theme";

const COOKIE_NAME = "theme_mode";
const VALID_MODES: ReadonlyArray<ThemeMode> = ["light", "dark", "system"];
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

function normalize(value: unknown): ThemeMode | null {
  return VALID_MODES.includes(value as ThemeMode) ? (value as ThemeMode) : null;
}

/**
 * Reconcile the theme_mode cookie with the freshly-fetched business value.
 * Returns whether the cookie changed so the caller can refresh the route
 * and pick up the new forcedTheme on the server side.
 */
export async function syncThemeModeCookie(
  next: ThemeMode | null | undefined,
): Promise<{ changed: boolean }> {
  const cookieStore = await cookies();
  const current = normalize(cookieStore.get(COOKIE_NAME)?.value ?? null);
  const desired = normalize(next);

  if (current === desired) return { changed: false };

  if (desired === null) {
    cookieStore.delete(COOKIE_NAME);
  } else {
    cookieStore.set(COOKIE_NAME, desired, {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
  }

  return { changed: true };
}
