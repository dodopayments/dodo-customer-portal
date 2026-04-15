"use server";

import { defaultLocale, locales, LOCALE_COOKIE_OPTIONS, type Locale } from "@/i18n/config";
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
  try {
    (await cookies()).set(COOKIE_NAME, locale, LOCALE_COOKIE_OPTIONS);
  } catch (error) {
    console.error("[i18n] Failed to set locale cookie", { locale, error });
  }
}
