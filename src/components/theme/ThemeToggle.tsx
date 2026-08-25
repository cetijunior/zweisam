"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={style}
      className={`relative flex h-11 w-11 items-center justify-center text-current transition-opacity hover:opacity-70 disabled:opacity-40 ${className}`}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden className="relative block h-[14px] w-[14px]">
        {/* Sun — thin ring + rays */}
        <svg
          viewBox="0 0 14 14"
          fill="none"
          className={`absolute inset-0 transition-opacity duration-300 ${
            isDark ? "opacity-0" : "opacity-100"
          }`}
        >
          <circle cx="7" cy="7" r="2.25" stroke="currentColor" strokeWidth="1" />
          <path
            d="M7 1.25v1.1M7 11.65v1.1M1.25 7h1.1M11.65 7h1.1M2.85 2.85l.78.78M10.37 10.37l.78.78M2.85 11.15l.78-.78M10.37 3.63l.78-.78"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
        {/* Moon — thin crescent */}
        <svg
          viewBox="0 0 14 14"
          fill="none"
          className={`absolute inset-0 transition-opacity duration-300 ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        >
          <path
            d="M8.2 1.6A5.35 5.35 0 1 0 12.4 8.1 4.2 4.2 0 0 1 8.2 1.6Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
