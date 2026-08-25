import React from "react";
import Link from "next/link";
import { WifiOff, BookOpen, RotateCcw, Search, Home } from "lucide-react";

export const dynamic = "force-static";

export default function OfflineFallbackPage() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-center text-amber-400">
        <WifiOff className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
          You&apos;re Offline
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          Your previously downloaded Banking Current Affairs library and revision engine remain fully accessible on this device.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-left space-y-3 text-xs font-mono">
        <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
          Available Offline:
        </div>
        <ul className="space-y-2 text-[var(--text-muted)]">
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">•</span>
            <span>Read cached canonical topics and threshold summaries</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">•</span>
            <span>Run 15/30/60 min active recall revision sessions</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-400">•</span>
            <span>Search cached registry topics and institutions</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link
          href="/dashboard"
          className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/revision"
          className="p-3 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Revision Hub</span>
        </Link>
      </div>
    </div>
  );
}
