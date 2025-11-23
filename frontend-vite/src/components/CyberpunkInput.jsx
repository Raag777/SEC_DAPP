// frontend-vite/src/components/CyberpunkInput.jsx
import React, { useState } from "react";

export default function CyberpunkInput({ label, className = "", ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full my-6">

      {/* Input */}
      <input
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={(e) => setFocused(e.target.value !== "")}
        className={`
          w-full px-4 py-3 bg-black/40 dark:bg-neutral-800/60
          text-neonBlue border border-neonBlue/40 rounded-xl
          focus:border-neonBlue focus:shadow-neon
          outline-none transition-all duration-300
          backdrop-blur-md cyberpunk-input
          ${className}
        `}
      />

      {/* Floating Label */}
      <label
        className={`
          absolute left-4 pointer-events-none transition-all duration-300
          ${focused ? "-top-3 text-xs neon-text" : "top-3 text-gray-400"}
        `}
      >
        {label}
      </label>

      {/* Underline Glow */}
      <div
        className={`
          absolute left-0 bottom-0 h-0.5 w-full
          transition-all duration-500
          ${focused ? "cyber-gradient shadow-neon" : "bg-transparent"}
        `}
      />

      {/* Pulse Ring Glow */}
      {focused && (
        <span className="absolute inset-0 rounded-xl animate-glowPulse pointer-events-none"></span>
      )}
    </div>
  );
}
