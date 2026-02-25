/**
 * Message payload for parent → demo theme updates (postMessage).
 * Parent sends: iframe.contentWindow.postMessage({ type: "dodo-theme-update", theme?, themeConfig? }, "*")
 */
export interface DodoThemeUpdateMessage {
  type: "dodo-theme-update";
  theme?: "light" | "dark";
  themeConfig?: Record<string, string>;
}
