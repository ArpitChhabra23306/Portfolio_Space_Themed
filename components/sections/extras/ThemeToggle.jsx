"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Sun/moon glass icon button for toggling between dark and light themes.
 * Updates localStorage.theme + data-theme on <html> without page reload.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Read the current theme from the document (set by inline head script)
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // localStorage unavailable (private browsing, quota) — visual toggle still works
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full
        text-text-muted hover:text-text-primary hover:bg-white/10
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember
        transition-colors cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
}
