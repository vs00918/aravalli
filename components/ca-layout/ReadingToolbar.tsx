"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, 
  Home, 
  Search, 
  Zap, 
  Printer, 
  Maximize2, 
  Minimize2, 
  Type,
  Sun,
  Moon,
  BookOpen
} from "lucide-react";

interface ReadingToolbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

type ThemeMode = "sepia" | "warm" | "night";

export function ReadingToolbar({ onToggleSidebar, isSidebarOpen }: ReadingToolbarProps) {
  const [theme, setTheme] = useState<ThemeMode>("sepia");
  const [fontSize, setFontSize] = useState<number>(15);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 1. Initialize Theme & Font Size from Storage
  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("banking_ca_theme") as ThemeMode) || "sepia";
      const savedFont = parseInt(localStorage.getItem("banking_ca_font_size") || "15", 10);
      
      setTheme(savedTheme);
      applyTheme(savedTheme);

      if (savedFont >= 13 && savedFont <= 20) {
        setFontSize(savedFont);
        applyFontSize(savedFont);
      }
    } catch {
      // Ignore storage errors in SSR
    }
  }, []);

  const applyTheme = (newTheme: ThemeMode) => {
    const html = document.documentElement;
    html.classList.remove("sepia", "warm", "night", "dark", "light");
    html.classList.add(newTheme);
    if (newTheme === "night") {
      html.classList.add("dark");
    }
    localStorage.setItem("banking_ca_theme", newTheme);
    setTheme(newTheme);
  };

  const applyFontSize = (size: number) => {
    document.documentElement.style.setProperty("--reader-font-size", `${size}px`);
    localStorage.setItem("banking_ca_font_size", size.toString());
    setFontSize(size);
  };

  const decreaseFont = () => {
    if (fontSize > 13) applyFontSize(fontSize - 1);
  };

  const increaseFont = () => {
    if (fontSize < 20) applyFontSize(fontSize + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <header className="h-13 sm:h-14 border-b border-[var(--border-primary)] bg-[var(--surface-primary)] px-3 sm:px-5 flex items-center justify-between sticky top-0 z-40 shadow-2xs select-none no-print">
      {/* Left: Navigation & Core Triggers */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Toggle Sidebar (☰)"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Command Center Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-semibold">Home</span>
        </Link>

        <Link
          href="/search"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Universal Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)] opacity-70">
            ⌘K
          </kbd>
        </Link>
      </div>

      {/* Center/Right: Theme & Reading Controls Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Theme Mode Selector */}
        <div className="flex items-center p-0.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[11px] font-mono">
          <button
            onClick={() => applyTheme("sepia")}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
              theme === "sepia"
                ? "bg-[var(--surface-primary)] text-[var(--text-primary)] font-bold shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title="Kindle Sepia Paper (Default)"
          >
            <BookOpen className="w-3 h-3 text-amber-800 dark:text-amber-400" />
            <span className="hidden sm:inline">Sepia</span>
          </button>

          <button
            onClick={() => applyTheme("warm")}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
              theme === "warm"
                ? "bg-[var(--surface-primary)] text-[var(--text-primary)] font-bold shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title="Warm Bright Mode"
          >
            <Sun className="w-3 h-3 text-amber-600" />
            <span className="hidden sm:inline">Warm</span>
          </button>

          <button
            onClick={() => applyTheme("night")}
            className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
              theme === "night"
                ? "bg-[var(--surface-primary)] text-[var(--text-primary)] font-bold shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title="Warm Night Dark Mode"
          >
            <Moon className="w-3 h-3 text-amber-300" />
            <span className="hidden sm:inline">Night</span>
          </button>
        </div>

        {/* Font Size Stepper */}
        <div className="hidden sm:flex items-center px-1.5 py-0.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[11px] font-mono text-[var(--text-muted)]">
          <button
            onClick={decreaseFont}
            disabled={fontSize <= 13}
            className="px-1.5 py-0.5 rounded hover:text-[var(--text-primary)] disabled:opacity-40 font-bold"
            title="Decrease Font Size"
          >
            A−
          </button>
          <span className="px-1 text-[10px] font-semibold text-[var(--text-primary)]">
            {fontSize}px
          </span>
          <button
            onClick={increaseFont}
            disabled={fontSize >= 20}
            className="px-1.5 py-0.5 rounded hover:text-[var(--text-primary)] disabled:opacity-40 font-bold"
            title="Increase Font Size"
          >
            A+
          </button>
        </div>

        {/* Drill Unit Action */}
        <Link
          href="/revision"
          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-mono text-xs font-bold transition-all shadow-xs"
          title="Launch Active Recall Drill"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden xs:inline">Drill Unit</span>
        </Link>

        {/* Fullscreen Focus */}
        <button
          onClick={toggleFullscreen}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Canvas"}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Print / PDF */}
        <button
          onClick={handlePrint}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          title="Print or Save Clean PDF"
          aria-label="Print or Save PDF"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
