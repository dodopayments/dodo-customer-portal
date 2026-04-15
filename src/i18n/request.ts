import { getUserLocale } from "@/lib/i18n-helper";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  const messages = await import(`../../messages/${locale}.json`)
    .then((m) => m.default)
    .catch((error) => {
      console.error(
        `[i18n] Failed to load messages for locale "${locale}" — falling back to English`,
        { error }
      );
      return import("../../messages/en.json").then((m) => m.default);
    });
  return { locale, messages };
});
