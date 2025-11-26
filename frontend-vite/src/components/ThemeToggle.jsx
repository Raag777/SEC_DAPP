// src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("sec_theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("sec_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("sec_theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="p-2 rounded-md bg-white/10 hover:scale-105 transition-transform neon-glow"
      aria-label="Toggle theme"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
