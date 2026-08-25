"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  RotateCw, 
  Landmark, 
  Calendar, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Clock,
  AlertTriangle,
  FolderOpen
} from "lucide-react";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface SidebarNavProps {
  registry: BankingCaMasterRegistry;
  isCollapsed?: boolean;
}

const MONTH_NAMES = [
  { id: "2026-08", name: "AUGUST 2026", active: true },
  { id: "2026-07", name: "JULY 2026", active: false },
  { id: "2026-06", name: "JUNE 2026", active: false },
  { id: "2026-05", name: "MAY 2026", active: false },
  { id: "2026-04", name: "APRIL 2026", active: false },
  { id: "2026-03", name: "MARCH 2026", active: false },
  { id: "2026-02", name: "FEBRUARY 2026", active: false },
  { id: "2026-01", name: "JANUARY 2026", active: false },
];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  BANKING_REGULATION: "Banking & Regulation",
  MONETARY_POLICY: "Monetary Policy",
  CAPITAL_MARKETS: "Capital Markets & SEBI",
  GOVERNMENT_SCHEMES: "Government Schemes",
  MACRO_ECONOMY: "Macro Economy & Fiscal",
  DIGITAL_PAYMENTS: "Digital Payments & UPI",
  APPOINTMENTS: "Key Appointments",
  INSURANCE_SECTOR: "Insurance & IRDAI",
  PENSION_SYSTEMS: "Pensions & PFRDA",
  REPORTS_AND_INDICES: "Reports & Indices",
  DEFENCE_AND_SCIENCE: "Defence & Science",
  SPORTS_AND_AWARDS: "Sports & Awards",
  NATIONAL_AND_STATES: "National & States"
};

export function SidebarNav({ registry, isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();
  const [expandedYear, setExpandedYear] = useState<boolean>(true);
  const [expandedMonth, setExpandedMonth] = useState<string>("2026-08");

  if (isCollapsed) {
    return null;
  }

  const summary = registry.summary;
  const changeAlertCount = registry.indexes.changeSensitiveTopicIds.length;

  const topNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/topics", label: "Canonical Topics", icon: BookOpen, badge: summary.totalCanonicalTopics.toString() },
    { href: "/revision", label: "Revision Hub", icon: RotateCw, badge: `${summary.activeP1RevisionMinutes}m` },
    { href: "/institutions", label: "Institutions", icon: Landmark },
    { href: "/chronology", label: "Chronology", icon: Calendar },
    { href: "/search", label: "Search Index", icon: Search },
  ];

  // Calculate dynamic category counts for the currently expanded month
  const monthTopicIds = registry.indexes.byYearMonth?.[expandedMonth] || registry.indexes.byMonth?.[expandedMonth] || [];
  const monthTopics = monthTopicIds.map(id => registry.topics[id]).filter(Boolean);

  const categoryCounts: Record<string, number> = {};
  for (const t of monthTopics) {
    categoryCounts[t.primaryCategory] = (categoryCounts[t.primaryCategory] || 0) + 1;
  }

  const activeCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);

  return (
    <aside className="w-68 flex-shrink-0 hidden md:flex flex-col border-r border-[var(--border-primary)] bg-[var(--surface-primary)] min-h-[calc(100vh-3.5rem)] select-none no-print">
      {/* Brand Logo & Target */}
      <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]/50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-amber-800/15 border border-amber-800/30 flex items-center justify-center text-amber-900 dark:text-amber-300 font-serif font-bold text-lg group-hover:scale-105 transition-transform shadow-xs">
            🏦
          </div>
          <div>
            <div className="font-serif font-bold text-sm tracking-tight text-[var(--text-primary)]">
              CA MENTOR OS
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              SBI &amp; IBPS PO Mains
            </div>
          </div>
        </Link>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* 1. Core Platform Links */}
        <nav className="space-y-1">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && !pathname.startsWith("/briefing"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-amber-800/10 text-amber-900 dark:text-amber-300 font-bold border-l-3 border-amber-800 dark:border-amber-600"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-800 dark:text-amber-400" : "text-[var(--text-subtle)]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 2. Month-First Current Affairs Tree */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-primary)]">
          <div className="px-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--text-subtle)] font-bold">
            <span>Current Affairs</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)]">
              2026 Cycle
            </span>
          </div>

          {/* Year Node (2026) */}
          <div className="space-y-1">
            <button
              onClick={() => setExpandedYear(!expandedYear)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-mono font-bold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {expandedYear ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>2026 Master Archive</span>
              </div>
              <span className="text-[10px] font-normal text-[var(--text-muted)]">
                {summary.totalCanonicalTopics} Topics
              </span>
            </button>

            {/* Months List */}
            {expandedYear && (
              <div className="pl-2 space-y-1">
                {MONTH_NAMES.map((m) => {
                  const isMonthActive = expandedMonth === m.id;
                  const monthCount = registry.indexes.byYearMonth?.[m.id]?.length || registry.indexes.byMonth?.[m.id]?.length || 0;
                  const isCurrentRoute = pathname === `/briefing/${m.id}` || (pathname === "/dashboard" && m.id === "2026-08");

                  return (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between group">
                        <button
                          onClick={() => setExpandedMonth(isMonthActive ? "" : m.id)}
                          className="p-1 hover:text-[var(--text-primary)] text-[var(--text-subtle)]"
                          aria-label={`Expand ${m.name}`}
                        >
                          {isMonthActive ? (
                            <ChevronDown className="w-3 h-3 text-amber-800 dark:text-amber-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </button>

                        <Link
                          href={`/briefing/${m.id}`}
                          className={`flex-1 flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-mono transition-colors ${
                            isCurrentRoute
                              ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold"
                              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          <span className="truncate">{m.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            monthCount > 0
                              ? "bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40"
                              : "bg-[var(--surface-elevated)] text-[var(--text-subtle)]"
                          }`}>
                            {monthCount > 0 ? monthCount : "—"}
                          </span>
                        </Link>
                      </div>

                      {/* Month Categories Tree */}
                      {isMonthActive && monthCount > 0 && (
                        <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-amber-800/20 dark:border-amber-600/20 ml-2">
                          <Link
                            href={`/briefing/${m.id}`}
                            className="flex items-center justify-between px-2 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                          >
                            <span>All Month Topics</span>
                            <span className="text-[10px] text-[var(--text-subtle)]">{monthCount}</span>
                          </Link>

                          {activeCategories.map((catKey) => {
                            const count = categoryCounts[catKey];
                            const label = CATEGORY_DISPLAY_NAMES[catKey] || catKey.replace(/_/g, " ");

                            return (
                              <Link
                                key={catKey}
                                href={`/briefing/${m.id}?category=${catKey}`}
                                className="flex items-center justify-between px-2 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                              >
                                <span className="truncate pr-1">{label}</span>
                                <span className="text-[10px] font-semibold text-[var(--text-subtle)]">{count}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Revision Deck Widget */}
      <div className="p-3.5 m-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" /> P1 Study Deck
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/50">
            {summary.activeP1RevisionMinutes} min
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-subtle)] leading-relaxed">
          {summary.activeP1Count} high-conviction master topics for today&apos;s cycle.
        </div>
        {changeAlertCount > 0 && (
          <div className="pt-1.5 border-t border-[var(--border-primary)] flex items-center gap-1.5 text-[10px] text-amber-800 dark:text-amber-400 font-mono font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{changeAlertCount} Change Alert active</span>
          </div>
        )}
      </div>

      {/* Target Exam Footer */}
      <div className="p-3 border-t border-[var(--border-primary)] text-center text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--surface-elevated)]/30">
        Target: SBI PO (Sep 2026) · IBPS PO (Oct 2026)
      </div>
    </aside>
  );
}
