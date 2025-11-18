// src/utils/theme.js
export function getInitialTheme() {
  const stored = typeof window !== "undefined" && localStorage.getItem("sec-dapp-theme");
  if (stored) return stored === "dark";
  // follow system preference if no stored value
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}
