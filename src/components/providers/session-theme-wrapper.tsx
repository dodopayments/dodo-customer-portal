import { ThemeConfig } from "@/types/theme";
import {
  generateSessionThemeCSS,
  extractFontUrls,
  generateFontVarsCSS,
} from "@/lib/session-theme-helper";

interface SessionThemeWrapperProps {
  children: React.ReactNode;
  sessionThemeConfig?: ThemeConfig | null;
}

/**
 * Server component — injects merchant theme as inline CSS variables (SSR).
 *
 * When a business has a theme_config:
 *   - CSS variables are written into a <style> tag on the server (no flash / FOUC)
 *   - Custom Google Fonts are preloaded and loaded via <link> tags
 *
 * When there is no theme_config the component renders children unchanged,
 * leaving all default CSS variable values in globals.css intact.
 */
export default function SessionThemeWrapper({
  children,
  sessionThemeConfig,
}: SessionThemeWrapperProps) {
  if (!sessionThemeConfig) {
    return <>{children}</>;
  }

  const { primaryUrl, secondaryUrl } = extractFontUrls(sessionThemeConfig);
  const themeCss = generateSessionThemeCSS(sessionThemeConfig);
  const fontVarsCss = generateFontVarsCSS(primaryUrl, secondaryUrl);
  const inlineCSS = [fontVarsCss, themeCss].filter(Boolean).join(" ");

  return (
    <>
      {/* Preload fonts to prevent flash of unstyled text */}
      {primaryUrl && <link rel="preload" href={primaryUrl} as="style" />}
      {secondaryUrl && <link rel="preload" href={secondaryUrl} as="style" />}

      {/* Load fonts */}
      {primaryUrl && <link rel="stylesheet" href={primaryUrl} />}
      {secondaryUrl && <link rel="stylesheet" href={secondaryUrl} />}

      {/* Inject CSS variables — runs before paint, no jitter */}
      {inlineCSS && (
        <style dangerouslySetInnerHTML={{ __html: inlineCSS }} />
      )}

      {children}
    </>
  );
}
