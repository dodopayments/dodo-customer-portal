import { ThemeConfig } from "@/types/theme";
import { generateSessionThemeCSS, extractFontUrls } from "@/lib/session-theme-helper";

interface SessionThemeWrapperProps {
  children: React.ReactNode;
  sessionThemeConfig?: ThemeConfig | null;
}

/**
 * Parse a Google Fonts URL and return the CSS font-family string.
 * e.g. "https://fonts.googleapis.com/css2?family=Inter:wght@400;700"
 *   → "'Inter', sans-serif"
 */
function parseFontFamily(url: string): string | null {
  try {
    const familyParam = new URL(url).searchParams.get("family");
    if (!familyParam) return null;
    const name = familyParam.split(":")[0].replace(/\+/g, " ");
    return `'${name}', sans-serif`;
  } catch {
    return null;
  }
}

/**
 * Generate CSS for overriding the app font variables.
 *
 * primaryUrl   → replaces --font-display-grotesk (display / headings)
 * secondaryUrl → replaces --font-inter            (body text)
 *
 * Both also write to generic --font-primary / --font-secondary vars.
 */
function generateFontVarsCSS(
  primaryUrl: string | null,
  secondaryUrl: string | null,
): string {
  const vars: string[] = [];

  if (primaryUrl) {
    const family = parseFontFamily(primaryUrl);
    if (family) {
      vars.push(`--font-display-grotesk: ${family}`);
      vars.push(`--font-primary: ${family}`);
    }
  }

  if (secondaryUrl) {
    const family = parseFontFamily(secondaryUrl);
    if (family) {
      vars.push(`--font-inter: ${family}`);
      vars.push(`--font-secondary: ${family}`);
    }
  }

  return vars.length > 0 ? `:root { ${vars.join("; ")} }` : "";
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
