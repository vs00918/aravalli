"use client";

import React from "react";
import Link from "next/link";
import { Search, ShieldAlert, Sparkles } from "lucide-react";

interface HeaderProps {
  activeP1Count: number;
  activeP1Minutes: number;
  changeAlertCount: number;
}

export function Header({ activeP1Count, activeP1Minutes, changeAlertCount }: HeaderProps) {
  return (
    <header className="h-14 border-b border-[var(--border-primary)] bg-[var(--surface-primary)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Target Exam Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[var(--text-primary)]">Exam Target:</span>
          <span>SBI PO Mains (Sep 2026) · IBPS PO Mains (Oct 2026)</span>
        </div>
      </div>

      {/* Action Buttons / Search Trigger */}
      <div className="flex items-center gap-3">
        {changeAlertCount > 0 && (
          <Link
            href="/dashboard#alerts"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-amber-950/30 text-amber-400 border border-amber-800/40 hover:bg-amber-900/40 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{changeAlertCount} Alert</span>
          </Link>
        )}

        <Link
          href="/search"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-primary)] transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search Index</span>
          <kbd className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)]">
            ⌘K
          </kbd>
        </Link>
      </div>
    </header>
  );
}
