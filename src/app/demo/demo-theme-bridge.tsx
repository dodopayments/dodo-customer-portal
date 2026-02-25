"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  generateSessionThemeCSSFromFlat,
  generateFontVarsCSS,
} from "@/lib/session-theme-helper";
import type { DodoThemeUpdateMessage } from "./types";

const DODO_THEME_UPDATE_TYPE = "dodo-theme-update";

function isSafeFontUrl(url: unknown): url is string {
  return typeof url === "string" && url.startsWith("https://");
}

export function DemoThemeBridge() {
  const { setTheme } = useTheme();
  const [themeConfig, setThemeConfig] = useState<Record<string, string> | null>(
    null,
  );
  const [fontPrimaryUrl, setFontPrimaryUrl] = useState<string | null>(null);
  const [fontSecondaryUrl, setFontSecondaryUrl] = useState<string | null>(null);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Optionally validate event.origin for production (e.g. same-origin or allowlist).
      const data = event.data as DodoThemeUpdateMessage | undefined;

      if (!data || typeof data !== "object" || data.type !== DODO_THEME_UPDATE_TYPE)
        return;

      if (data.theme === "light" || data.theme === "dark") {
        setTheme(data.theme);
      }

      const config = data.themeConfig;
      if (config && typeof config === "object") {
        setThemeConfig(config);
        setFontPrimaryUrl(isSafeFontUrl(config.fontPrimaryUrl) ? config.fontPrimaryUrl : null);
        setFontSecondaryUrl(isSafeFontUrl(config.fontSecondaryUrl) ? config.fontSecondaryUrl : null);
      }
    },
    [setTheme],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  const fontVarsCss = (fontPrimaryUrl || fontSecondaryUrl)
    ? generateFontVarsCSS(fontPrimaryUrl, fontSecondaryUrl)
    : "";
  const themeCss = themeConfig ? generateSessionThemeCSSFromFlat(themeConfig) : "";
  const inlineCSS = [fontVarsCss, themeCss].filter(Boolean).join(" ");

  return (
    <>
      {fontPrimaryUrl && (
        <link rel="stylesheet" href={fontPrimaryUrl} data-demo-theme-font="primary" />
      )}
      {fontSecondaryUrl && (
        <link rel="stylesheet" href={fontSecondaryUrl} data-demo-theme-font="secondary" />
      )}
      {inlineCSS ? (
        <style data-demo-theme-bridge dangerouslySetInnerHTML={{ __html: inlineCSS }} />
      ) : null}
    </>
  );
}
