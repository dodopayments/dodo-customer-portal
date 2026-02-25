import { z } from "zod";
import validateColor from "validate-color";
import { FontSize, FontWeight, ThemeConfig, ThemeModeConfig } from "@/types/theme";

/** oklch is not supported by validate-color — regex fallback */
const oklchRegex = /^oklch\s*\([\d\s./%°]+\)$/;

const isValidColor = (v: string) => validateColor(v) || oklchRegex.test(v);
const isValidRadius = (v: string) => /^0$|^\d+(\.\d+)?(px|rem|em|%)$/.test(v);
const isValidFontUrl = (v: string) =>
  z.string().url().safeParse(v).success &&
  v.startsWith("https://") &&
  !/[<>"'{}]/.test(v);
const isValidButtonText = (v: string) => v.length <= 100 && /^[^<>{}]*$/.test(v);
const isValidFontSize = (v: string) => z.nativeEnum(FontSize).safeParse(v).success;
const isValidFontWeight = (v: string) => z.nativeEnum(FontWeight).safeParse(v).success;

const MODE_COLOR_KEYS: (keyof ThemeModeConfig)[] = [
  "bg_primary", "bg_secondary", "border_primary", "border_secondary",
  "button_primary", "button_primary_hover", "button_secondary", "button_secondary_hover",
  "button_text_primary", "button_text_secondary", "input_focus_border",
  "text_error", "text_placeholder", "text_primary", "text_secondary", "text_success",
];

function warn(field: string, value: unknown) {
  console.warn(`[theme_config] invalid value for ${field}: ${JSON.stringify(value)}`);
}

function validateModeConfig(
  config: ThemeModeConfig | null | undefined,
  mode: string,
): ThemeModeConfig | undefined {
  if (!config) return undefined;

  const clean: ThemeModeConfig = {};
  let hasValid = false;

  for (const key of MODE_COLOR_KEYS) {
    const value = config[key];
    if (value == null) continue;

    if (isValidColor(value)) {
      clean[key] = value;
      hasValid = true;
    } else {
      warn(`${mode}.${key}`, value);
    }
  }

  return hasValid ? clean : undefined;
}

/**
 * Validate a nested ThemeConfig from the API response.
 * Invalid fields are stripped individually with console.warn.
 */
export function validateThemeConfig(config: unknown): ThemeConfig | null {
  if (!config || typeof config !== "object") return null;

  const c = config as Record<string, unknown>;
  const clean: ThemeConfig = {};
  let hasValid = false;

  const light = validateModeConfig(c.light as ThemeModeConfig, "light");
  if (light) { clean.light = light; hasValid = true; }

  const dark = validateModeConfig(c.dark as ThemeModeConfig, "dark");
  if (dark) { clean.dark = dark; hasValid = true; }

  if (c.font_size != null) {
    if (isValidFontSize(c.font_size as string)) {
      clean.font_size = c.font_size as FontSize;
      hasValid = true;
    } else {
      warn("font_size", c.font_size);
    }
  }

  if (c.font_weight != null) {
    if (isValidFontWeight(c.font_weight as string)) {
      clean.font_weight = c.font_weight as FontWeight;
      hasValid = true;
    } else {
      warn("font_weight", c.font_weight);
    }
  }

  if (c.radius != null) {
    if (isValidRadius(c.radius as string)) {
      clean.radius = c.radius as string;
      hasValid = true;
    } else {
      warn("radius", c.radius);
    }
  }

  if (c.font_primary_url != null) {
    if (isValidFontUrl(c.font_primary_url as string)) {
      clean.font_primary_url = c.font_primary_url as string;
      hasValid = true;
    } else {
      warn("font_primary_url", c.font_primary_url);
    }
  }

  if (c.font_secondary_url != null) {
    if (isValidFontUrl(c.font_secondary_url as string)) {
      clean.font_secondary_url = c.font_secondary_url as string;
      hasValid = true;
    } else {
      warn("font_secondary_url", c.font_secondary_url);
    }
  }

  if (c.pay_button_text != null) {
    if (isValidButtonText(c.pay_button_text as string)) {
      clean.pay_button_text = c.pay_button_text as string;
      hasValid = true;
    } else {
      warn("pay_button_text", c.pay_button_text);
    }
  }

  return hasValid ? clean : null;
}

/**
 * Validate a font URL. Returns the URL if valid, null otherwise.
 */
export function validateFontUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (isValidFontUrl(url)) return url;
  warn("font_url", url);
  return null;
}

/**
 * Defense-in-depth: strip characters that could break out of a CSS context.
 */
export function sanitizeCSS(value: string): string {
  return value.replace(/[<>"'`;{}\\]/g, "");
}
