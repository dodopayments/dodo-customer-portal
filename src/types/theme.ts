/**
 * Theme configuration types for customer portal dynamic theming.
 * Mirrors the ThemeConfig shape returned by GET /customer-portal/business.
 */

export interface ThemeModeConfig {
  bg_primary?: string | null;
  bg_secondary?: string | null;
  border_primary?: string | null;
  border_secondary?: string | null;
  button_primary?: string | null;
  button_primary_hover?: string | null;
  button_secondary?: string | null;
  button_secondary_hover?: string | null;
  button_text_primary?: string | null;
  button_text_secondary?: string | null;
  input_focus_border?: string | null;
  text_error?: string | null;
  text_placeholder?: string | null;
  text_primary?: string | null;
  text_secondary?: string | null;
  text_success?: string | null;
}

export enum FontWeight {
  Normal = "normal",
  Medium = "medium",
  Bold = "bold",
  ExtraBold = "extraBold",
}

export enum FontSize {
  Xs = "xs",
  Sm = "sm",
  Md = "md",
  Lg = "lg",
  Xl = "xl",
  Value2Xl = "2xl",
}

export interface ThemeConfig {
  dark?: null | ThemeModeConfig;
  font_size?: null | FontSize;
  font_weight?: null | FontWeight;
  font_primary_url?: string | null;
  font_secondary_url?: string | null;
  light?: null | ThemeModeConfig;
  pay_button_text?: string | null;
  radius?: string | null;
}

export type ThemeMode = "dark" | "light" | "system";
