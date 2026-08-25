"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Moon, Sun } from "lucide-react";

type ThemeMode = "sepia" | "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("sepia");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("banking_ca_theme") as ThemeMode) || "sepia";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: ThemeMode) => {
    const html = document.documentElement;
    html.classList.remove("dark", "sepia", "light");

    if (newTheme === "dark") {
      html.classList.add("dark");
    } else if (newTheme === "sepia") {
      html.classList.add("sepia");
    } else {
      html.classList.add("light");
    }

    localStorage.setItem("banking_ca_theme", newTheme);
    setTheme(newTheme);
  };

  const cycleTheme = () => {
    if (theme === "sepia") applyTheme("dark");
    else if (theme === "dark") applyTheme("light");
    else applyTheme("sepia");
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shadow-sm"
      title={`Current theme: ${theme}. Click to switch theme.`}
      aria-label="Toggle Reading Theme"
    >
      {theme === "sepia" && (
        <>
          <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden sm:inline">Kindle Sepia</span>
        </>
      )}
      {theme === "dark" && (
        <>
          <Moon className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Warm Night</span>
        </>
      )}
      {theme === "light" && (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Clean Paper</span>
        </>
      )}
    </button>
  );
}
