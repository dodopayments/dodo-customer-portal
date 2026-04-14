"use server";

import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { cookies } from "next/headers";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale(): Promise<Locale> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale, {
    sameSite: "none",
    secure: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
