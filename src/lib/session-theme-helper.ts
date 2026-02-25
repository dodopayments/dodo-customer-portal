import { ThemeConfig, ThemeModeConfig } from "@/types/theme";
import { validateThemeConfig, validateFontUrl, sanitizeCSS } from "@/lib/theme-validators";

/**
 * Maps snake_case ThemeModeConfig keys → flat camelCase keys used internally.
 */
const THEME_MODE_FIELD_MAP: Record<keyof ThemeModeConfig, string> = {
  bg_primary:             "bgPrimary",
  bg_secondary:           "bgSecondary",
  border_primary:         "borderPrimary",
  border_secondary:       "borderSecondary",
  button_primary:         "buttonPrimary",
  button_primary_hover:   "buttonPrimaryHover",
  button_secondary:       "buttonSecondary",
  button_secondary_hover: "buttonSecondaryHover",
  button_text_primary:    "buttonTextPrimary",
  button_text_secondary:  "buttonTextSecondary",
  input_focus_border:     "inputFocusBorder",
  text_error:             "textError",
  text_placeholder:       "textPlaceholder",
  text_primary:           "textPrimary",
  text_secondary:         "textSecondary",
  text_success:           "textSuccess",
};

/**
 * Maps flat camelCase keys → portal CSS custom property names.
 */
const CSS_VARIABLE_MAP: Record<string, string[]> = {
  bgPrimary:            ["--bg-primary"],
  bgSecondary:          ["--bg-secondary"],
  borderPrimary:        ["--border-primary"],
  borderSecondary:      ["--border-secondary"],
  textPrimary:          ["--text-primary"],
  textSecondary:        ["--text-secondary"],
  textPlaceholder:      ["--text-placeholder"],
  textError:            ["--text-error-primary", "--border-error"],
  textSuccess:          ["--text-success-primary"],
  buttonPrimary:        ["--button-primary-bg"],
  buttonPrimaryHover:   ["--button-primary-bg-hover"],
  buttonTextPrimary:    ["--button-primary-text", "--button-primary-fg-hover"],
  buttonSecondary:      ["--button-secondary-bg"],
  buttonSecondaryHover: ["--button-secondary-bg-hover"],
  buttonTextSecondary:  ["--button-secondary-text", "--button-secondary-text-hover"],
  inputFocusBorder:     ["--border-brand"],
  radius:               ["--radius"],
};

const FONT_SIZES: Record<string, string> = {
  xs:    "12px",
  sm:    "13px",
  md:    "14px",
  lg:    "16px",
  xl:    "18px",
  "2xl": "20px",
};

const FONT_WEIGHTS: Record<string, string> = {
  normal:    "400",
  medium:    "500",
  bold:      "700",
  extraBold: "900",
};

/**
 * Convert a nested ThemeConfig into a flat Record<string, string>.
 * Light keys: e.g. "bgPrimary". Dark keys: e.g. "dark_bgPrimary".
 */
export const flatThemeConfig = (
  themeConfig: ThemeConfig | null | undefined,
): Record<string, string> | null => {
  if (!themeConfig) return null;

  const validated = validateThemeConfig(themeConfig);
  if (!validated) return null;

  const flat: Record<string, string> = {};

  const mapModeConfig = (
    config: ThemeModeConfig | null | undefined,
    prefix: string = "",
  ) => {
    if (!config) return;
    for (const [snakeKey, camelKey] of Object.entries(THEME_MODE_FIELD_MAP)) {
      const value = config[snakeKey as keyof ThemeModeConfig];
      if (value) {
        flat[prefix ? `${prefix}_${camelKey}` : camelKey] = value;
      }
    }
  };

  mapModeConfig(validated.light);
  mapModeConfig(validated.dark, "dark");

  if (validated.font_size)          flat.fontSize         = validated.font_size;
  if (validated.font_weight)        flat.fontWeight       = validated.font_weight;
  if (validated.radius)             flat.radius           = validated.radius;
  if (validated.font_primary_url)   flat.fontPrimaryUrl   = validated.font_primary_url;
  if (validated.font_secondary_url) flat.fontSecondaryUrl = validated.font_secondary_url;

  return Object.keys(flat).length > 0 ? flat : null;
};

/**
 * Extract and validate font URLs from a ThemeConfig.
 */
export const extractFontUrls = (
  themeConfig: ThemeConfig | null | undefined,
): { primaryUrl: string | null; secondaryUrl: string | null } => ({
  primaryUrl:   validateFontUrl(themeConfig?.font_primary_url),
  secondaryUrl: validateFontUrl(themeConfig?.font_secondary_url),
});

// ---------------------------------------------------------------------------
// CSS generation
// ---------------------------------------------------------------------------

/** Generate color CSS vars for a single mode (light or dark). */
const generateColorCSSForMode = (
  flatConfig: Record<string, string>,
  mode: "light" | "dark",
): string => {
  const vars: string[] = [];
  const colorKeys = Object.keys(CSS_VARIABLE_MAP).filter((k) => k !== "radius");

  for (const key of colorKeys) {
    const value = mode === "dark" ? flatConfig[`dark_${key}`] : flatConfig[key];
    if (!value) continue;
    const safe = sanitizeCSS(value);
    for (const cssVar of CSS_VARIABLE_MAP[key]) {
      vars.push(`${cssVar}: ${safe}`);
    }
  }

  return vars.join("; ");
};

/** Generate shared (mode-agnostic) CSS vars: font size, weight, radius. */
const generateSharedCSS = (flatConfig: Record<string, string>): string => {
  const vars: string[] = [];

  const fontSizeValue = FONT_SIZES[flatConfig.fontSize ?? "md"] ?? FONT_SIZES.md;
  vars.push(`--base-font-size: ${fontSizeValue}`);

  const fontWeightValue = FONT_WEIGHTS[flatConfig.fontWeight ?? "medium"] ?? FONT_WEIGHTS.medium;
  vars.push(`--font-weight-body: ${fontWeightValue}`);

  if (flatConfig.radius) {
    const safeRadius = sanitizeCSS(flatConfig.radius);
    for (const cssVar of CSS_VARIABLE_MAP["radius"]) {
      vars.push(`${cssVar}: ${safeRadius}`);
    }
  }

  return vars.join("; ");
};

/**
 * Generate a complete CSS string for SSR injection.
 *
 * Produces:
 *   :root { shared vars }
 *   :root:not(.dark) { light color vars }
 *   .dark { dark color vars }
 */
export const generateSessionThemeCSS = (
  themeConfig: ThemeConfig | null | undefined,
): string => {
  if (!themeConfig) return "";

  const flatConfig = flatThemeConfig(themeConfig);
  if (!flatConfig) return "";

  const sharedCSS = generateSharedCSS(flatConfig);
  const lightCSS  = generateColorCSSForMode(flatConfig, "light");
  const darkCSS   = generateColorCSSForMode(flatConfig, "dark");

  let css = "";
  if (sharedCSS) css += `:root { ${sharedCSS} }`;
  if (lightCSS)  css += ` :root:not(.dark) { ${lightCSS} }`;
  if (darkCSS)   css += ` .dark { ${darkCSS} }`;

  return css;
};
