export interface Language {
  id: string;
  code: string;
  name: string;
  flag: string;
}

export const languages = [
  { id: "en", code: "en", name: "English", flag: "GB" },
  { id: "de", code: "de", name: "German", flag: "DE" },
  { id: "ar", code: "ar", name: "Arabic", flag: "SA" },
  { id: "ca", code: "ca", name: "Catalan", flag: "ES" },
  { id: "zh", code: "zh", name: "Chinese", flag: "CN" },
  { id: "es", code: "es", name: "Spanish", flag: "ES" },
  { id: "fr", code: "fr", name: "French", flag: "FR" },
  { id: "he", code: "he", name: "Hebrew", flag: "IL" },
  { id: "it", code: "it", name: "Italian", flag: "IT" },
  { id: "id", code: "id", name: "Indonesian", flag: "ID" },
  { id: "ja", code: "ja", name: "Japanese", flag: "JP" },
  { id: "ko", code: "ko", name: "Korean", flag: "KR" },
  { id: "ms", code: "ms", name: "Malay", flag: "MY" },
  { id: "nl", code: "nl", name: "Dutch", flag: "NL" },
  { id: "ro", code: "ro", name: "Romanian", flag: "RO" },
  { id: "ru", code: "ru", name: "Russian", flag: "RU" },
  { id: "th", code: "th", name: "Thai", flag: "TH" },
  { id: "pl", code: "pl", name: "Polish", flag: "PL" },
  { id: "pt", code: "pt", name: "Portuguese", flag: "PT" },
  { id: "sv", code: "sv", name: "Swedish", flag: "SE" },
  { id: "tr", code: "tr", name: "Turkish", flag: "TR" },
] as const satisfies readonly Language[];

export const locales = languages.map((lang) => lang.code);

export type Locale = (typeof languages)[number]["code"];
export const defaultLocale: Locale = "en";
