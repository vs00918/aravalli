"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, 
  LayoutDashboard, 
  BookOpen, 
  RotateCw, 
  Landmark, 
  Calendar, 
  Search, 
  Clock,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface MobileNavProps {
  registry: BankingCaMasterRegistry;
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_NAMES = [
  { id: "2026-08", name: "August 2026", count: 67 },
  { id: "2026-07", name: "July 2026", count: 0 },
  { id: "2026-06", name: "June 2026", count: 0 },
  { id: "2026-05", name: "May 2026", count: 0 },
  { id: "2026-04", name: "April 2026", count: 0 },
  { id: "2026-03", name: "March 2026", count: 0 },
  { id: "2026-02", name: "February 2026", count: 0 },
  { id: "2026-01", name: "January 2026", count: 0 },
];

export function MobileNav({ registry, isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const [caExpanded, setCaExpanded] = useState(true);

  if (!isOpen) return null;

  const summary = registry.summary;

  const topNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/topics", label: "Canonical Topics", icon: BookOpen, badge: summary.totalCanonicalTopics.toString() },
    { href: "/revision", label: "Revision Hub", icon: RotateCw, badge: `${summary.activeP1RevisionMinutes}m` },
    { href: "/institutions", label: "Institutions", icon: Landmark },
    { href: "/chronology", label: "Chronology", icon: Calendar },
    { href: "/search", label: "Search Index", icon: Search },
  ];

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
      <div className="w-4/5 max-w-xs bg-[var(--surface-primary)] border-r border-[var(--border-primary)] h-full flex flex-col p-4 space-y-4 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏦</span>
            <span className="font-serif font-bold text-sm text-[var(--text-primary)]">
              CA MENTOR OS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Links */}
        <nav className="space-y-1">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && !pathname.startsWith("/briefing"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/30"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-800 dark:text-amber-400" : "text-[var(--text-subtle)]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Current Affairs Monthly Stream */}
        <div className="pt-2 border-t border-[var(--border-primary)] space-y-1">
          <button
            onClick={() => setCaExpanded(!caExpanded)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-subtle)] font-bold hover:text-[var(--text-primary)]"
          >
            <span>Current Affairs 2026</span>
            {caExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {caExpanded && (
            <div className="pl-2 space-y-1">
              {MONTH_NAMES.map((m) => {
                const count = registry.indexes.byYearMonth?.[m.id]?.length || registry.indexes.byMonth?.[m.id]?.length || 0;
                const isCurrent = pathname === `/briefing/${m.id}`;

                return (
                  <Link
                    key={m.id}
                    href={`/briefing/${m.id}`}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                      isCurrent
                        ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface-elevated)] text-[var(--text-subtle)]">
                      {count > 0 ? count : "—"}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Revision Footer */}
        <div className="mt-auto pt-3 border-t border-[var(--border-primary)]">
          <Link
            href="/revision"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Start Today&apos;s Revision ({summary.activeP1RevisionMinutes}m)</span>
          </Link>
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
