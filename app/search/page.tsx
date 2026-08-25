"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookOpen, Clock } from "lucide-react";

export default function SearchIndexPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <Search className="w-4 h-4" />
          <span>Universal Index</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Search Current Affairs
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Search by institution (RBI, SEBI, NPCI), scheme name, committee, or monetary policy keyword.
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search topics (e.g. 'repo rate', 'NBFC upper layer', 'Maldives')..."
          className="w-full px-4 py-3 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-emerald-500 font-sans"
        />
        <div className="absolute right-3 top-3.5 text-xs font-mono text-[var(--text-subtle)]">
          Phase W6 Engine
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4">
        <h2 className="font-serif font-bold text-sm text-[var(--text-primary)]">
          Quick Filters &amp; Fast Jump
        </h2>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <Link href="/topics" className="px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-muted)] hover:text-emerald-400 transition-colors">
            All Canonical Topics →
          </Link>
          <Link href="/dashboard" className="px-3 py-1.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800/40 text-emerald-400 transition-colors">
            P1 Master Deck →
          </Link>
          <Link href="/institutions" className="px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-muted)] hover:text-emerald-400 transition-colors">
            Institutions →
          </Link>
        </div>
      </div>
    </div>
  );
}
