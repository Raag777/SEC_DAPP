// src/utils/theme.js
export const THEME_KEY = "sec_theme_v1";

export function getInitialTheme() {
  const stored = typeof window !== "undefined" && localStorage.getItem(THEME_KEY);
  if (stored) return stored === "dark";
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

export function setTheme(isDark) {
  document.documentElement.classList.toggle("dark", !!isDark);
  localStorage.setItem(THEME_KEY, !!isDark ? "dark" : "light");
}
