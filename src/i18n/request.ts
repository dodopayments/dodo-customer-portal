import { getUserLocale } from "@/lib/i18n-helper";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  const messages = await import(`../../messages/${locale}.json`)
    .then((m) => m.default)
    .catch(() => import("../../messages/en.json").then((m) => m.default));
  return { locale, messages };
});
