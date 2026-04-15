export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages = [
  { code: "en", name: "English", flag: "GB" },
  { code: "de", name: "German", flag: "DE" },
  { code: "ar", name: "Arabic", flag: "SA" },
  { code: "ca", name: "Catalan", flag: "ES" },
  { code: "zh", name: "Chinese", flag: "CN" },
  { code: "es", name: "Spanish", flag: "ES" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "he", name: "Hebrew", flag: "IL" },
  { code: "it", name: "Italian", flag: "IT" },
  { code: "id", name: "Indonesian", flag: "ID" },
  { code: "ja", name: "Japanese", flag: "JP" },
  { code: "ko", name: "Korean", flag: "KR" },
  { code: "ms", name: "Malay", flag: "MY" },
  { code: "nl", name: "Dutch", flag: "NL" },
  { code: "ro", name: "Romanian", flag: "RO" },
  { code: "ru", name: "Russian", flag: "RU" },
  { code: "th", name: "Thai", flag: "TH" },
  { code: "pl", name: "Polish", flag: "PL" },
  { code: "pt", name: "Portuguese", flag: "PT" },
  { code: "sv", name: "Swedish", flag: "SE" },
  { code: "tr", name: "Turkish", flag: "TR" },
] as const satisfies readonly Language[];

export const locales = languages.map((lang) => lang.code);

export type Locale = (typeof languages)[number]["code"];
export const defaultLocale: Locale = "en";

// sameSite: "none" required for Safari/iframe embedding (cross-origin payment widget).
export const LOCALE_COOKIE_OPTIONS = {
  sameSite: "none" as const,
  secure: true,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
} as const;
