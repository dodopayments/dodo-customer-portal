"use client";

import { useCallback, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { GlobeSimple } from "@phosphor-icons/react";
import flags from "react-phone-number-input/flags";
import * as RPNInput from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { languages } from "@/i18n/config";
import { cn } from "@/lib/utils";

const sortedLanguages = [...languages].sort((a, b) =>
  a.name.localeCompare(b.name)
);

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="w-4 overflow-hidden rounded-[2px]">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <div className="w-4 h-3 bg-bg-tertiary rounded-sm" />
      )}
    </span>
  );
};

function detectBrowserLanguage(): string {
  if (typeof navigator === "undefined") return "en";
  const browserLangs = navigator.languages || [navigator.language];
  return (
    browserLangs
      .map((l) => l.split("-")[0])
      .find((l) => languages.some((lang) => lang.code === l)) || "en"
  );
}

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const locale = useLocale();
  const router = useRouter();
  const currentLanguage = languages.find((l) => l.code === locale);

  const handleLanguageChange = useCallback(
    (value: string) => {
      if (value === locale) return;

      setCookie("NEXT_LOCALE", value, {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "none",
        secure: true,
        path: "/",
      });

      // Safari blocks cookies in iframes — fall back to URL param which middleware picks up
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        const url = new URL(window.location.href);
        url.searchParams.set("forceLanguage", value);
        window.location.href = url.toString();
        return;
      }

      router.refresh();
    },
    [locale, router]
  );

  // Auto-detect browser language on first visit (no cookie set yet)
  useEffect(() => {
    const isInIframe = window.self !== window.top;
    if (!isInIframe && !getCookie("NEXT_LOCALE")) {
      const detected = detectBrowserLanguage();
      if (detected !== locale) {
        handleLanguageChange(detected);
      }
    }
  }, [handleLanguageChange, locale]);

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger
        className={cn("w-fit h-[32px] bg-transparent p-0", className)}
      >
        <div className="flex w-fit font-display text-xs items-center gap-2 h-[32px] pl-2">
          {currentLanguage ? (
            <FlagComponent
              country={currentLanguage.flag as RPNInput.Country}
              countryName={currentLanguage.name}
            />
          ) : (
            <GlobeSimple className="w-4 h-4" />
          )}
          <span className="text-text-primary font-normal text-xs">
            {locale.toUpperCase()}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {sortedLanguages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <FlagComponent
                country={language.flag as RPNInput.Country}
                countryName={language.name}
              />
              <span className="text-xs">{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
