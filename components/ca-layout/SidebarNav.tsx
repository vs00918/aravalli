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
  FileText, 
  Compass,
  PanelLeftOpen,
  PanelLeftClose
} from "lucide-react";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface SidebarNavProps {
  registry: BankingCaMasterRegistry;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ALL_2026_MONTHS = [
  { id: "2026-12", name: "December" },
  { id: "2026-11", name: "November" },
  { id: "2026-10", name: "October" },
  { id: "2026-09", name: "September" },
  { id: "2026-08", name: "August" },
  { id: "2026-07", name: "July" },
  { id: "2026-06", name: "June" },
  { id: "2026-05", name: "May" },
  { id: "2026-04", name: "April" },
  { id: "2026-03", name: "March" },
  { id: "2026-02", name: "February" },
  { id: "2026-01", name: "January" },
];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  BANKING_REGULATION: "Banking & Regulation",
  MONETARY_POLICY: "Monetary Policy",
  CAPITAL_MARKETS: "Capital Markets & SEBI",
  GOVERNMENT_SCHEMES: "Government Schemes",
  MACRO_ECONOMY: "Economy & Fiscal",
  DIGITAL_PAYMENTS: "Digital Payments & UPI",
  APPOINTMENTS: "Key Appointments",
  INSURANCE_SECTOR: "Insurance & IRDAI",
  PENSION_SYSTEMS: "Pensions & PFRDA",
  REPORTS_AND_INDICES: "Reports & Indices",
  DEFENCE_AND_SCIENCE: "Defence & Science",
  SPORTS_AND_AWARDS: "Sports & Awards",
  NATIONAL_AND_STATES: "National & States",
  INTERNATIONAL_AFFAIRS: "International Affairs"
};

export function SidebarNav({ registry, isCollapsed, onToggleCollapse }: SidebarNavProps) {
  const pathname = usePathname();
  const [expandedYear, setExpandedYear] = useState<boolean>(true);
  const [expandedMonth, setExpandedMonth] = useState<string>("2026-08");

  const summary = registry.summary;
  const changeAlertCount = registry.indexes.changeSensitiveTopicIds.length;

  // ─── COLLAPSED ICON RAIL (NARROW ~56px) ───
  if (isCollapsed) {
    return (
      <aside className="w-14 flex-shrink-0 hidden md:flex flex-col items-center py-3 border-r border-[var(--border-primary)] bg-[var(--surface-primary)] min-h-[calc(100vh-3.5rem)] select-none no-print justify-between">
        {/* Top Section */}
        <div className="w-full flex flex-col items-center space-y-3">
          {/* Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}

          <div className="w-8 border-b border-[var(--border-primary)]" />

          {/* Navigation Icon List */}
          <nav className="flex flex-col items-center space-y-1.5 w-full px-1.5">
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                pathname === "/dashboard"
                  ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Command Center / Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>

            {/* Continuous Briefing Stream */}
            <Link
              href="/briefing/2026-08"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                pathname.startsWith("/briefing")
                  ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Monthly Reading Stream (August 2026)"
            >
              <BookOpen className="w-4 h-4" />
            </Link>

            {/* Canonical Topics */}
            <Link
              href="/topics"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                pathname === "/topics" || pathname.startsWith("/topics/")
                  ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
              title={`Canonical Topics (${summary.totalCanonicalTopics})`}
            >
              <Compass className="w-4 h-4" />
            </Link>

            {/* Institutions */}
            <Link
              href="/institutions"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                pathname === "/institutions"
                  ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Institutions"
            >
              <Landmark className="w-4 h-4" />
            </Link>

            {/* Chronology Tree */}
            <Link
              href="/chronology"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                pathname === "/chronology"
                  ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Chronology & Rapid Revision Sheets"
            >
              <Calendar className="w-4 h-4" />
            </Link>

            {/* Universal Search */}
            <Link
              href="/search"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                pathname === "/search"
                  ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
              title="Search Index (⌘K)"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Revision Hub */}
            <Link
              href="/revision"
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                pathname === "/revision"
                  ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-800/40"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
              title={`Revision Hub (${summary.activeP1RevisionMinutes}m)`}
            >
              <RotateCw className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            </Link>
          </nav>
        </div>

        {/* Bottom P1 Quick Pill */}
        <div className="flex flex-col items-center">
          <Link
            href="/revision"
            className="w-7 h-7 rounded-full bg-amber-800/15 border border-amber-800/30 flex items-center justify-center text-amber-900 dark:text-amber-300 text-[10px] font-mono font-bold hover:scale-105 transition-transform"
            title={`Active P1 Deck: ${summary.activeP1Count} topics (${summary.activeP1RevisionMinutes}m)`}
          >
            P1
          </Link>
        </div>
      </aside>
    );
  }

  // 1. COMMAND
  const commandItems = [
    { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  ];

  // 2. KNOWLEDGE
  const knowledgeItems = [
    { href: "/topics", label: "Canonical Topics", icon: BookOpen, badge: summary.totalCanonicalTopics.toString() },
    { href: "/institutions", label: "Institutions", icon: Landmark },
    { href: "/chronology", label: "Chronology Tree", icon: Calendar },
    { href: "/search", label: "Search Index", icon: Search },
  ];

  // 3. REVISION
  const revisionItems = [
    { href: "/revision", label: "Revision Hub", icon: RotateCw, badge: `${summary.activeP1RevisionMinutes}m` },
    { href: "/chronology", label: "Rapid Revision Sheets", icon: FileText },
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
    <aside className="w-64 sm:w-70 flex-shrink-0 hidden md:flex flex-col border-r border-[var(--border-primary)] bg-[var(--surface-primary)] min-h-[calc(100vh-3.5rem)] select-none no-print transition-all">
      {/* Brand Header with Collapse Button */}
      <div className="p-3.5 border-b border-[var(--border-primary)] bg-[var(--surface-elevated)]/50 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group flex-1">
          <div className="w-8 h-8 rounded-xl bg-amber-800/15 border border-amber-800/30 flex items-center justify-center text-amber-900 dark:text-amber-300 font-serif font-bold text-base group-hover:scale-105 transition-transform shadow-xs">
            🏦
          </div>
          <div>
            <div className="font-serif font-bold text-sm tracking-tight text-[var(--text-primary)]">
              CA MENTOR OS
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">
              Living Exam Intelligence
            </div>
          </div>
        </Link>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* PILLAR 1: COMMAND */}
        <div className="space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] font-bold">
            Command
          </div>
          {commandItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border-l-3 border-amber-800 dark:border-amber-600"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-800 dark:text-amber-400" : "text-[var(--text-subtle)]"}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* PILLAR 2: KNOWLEDGE */}
        <div className="space-y-1 pt-2 border-t border-[var(--border-primary)]/80">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] font-bold">
            Knowledge
          </div>
          {knowledgeItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border-l-3 border-amber-800 dark:border-amber-600"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-800 dark:text-amber-400" : "text-[var(--text-subtle)]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)] font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* PILLAR 3: CURRENT AFFAIRS 2026 ARCHIVE */}
        <div className="space-y-1.5 pt-2 border-t border-[var(--border-primary)]/80">
          <div className="px-2.5 py-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] font-bold">
            <span>Current Affairs</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)]">
              2026 Archive
            </span>
          </div>

          {/* Year Node */}
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
                {ALL_2026_MONTHS.map((m) => {
                  const isMonthActive = expandedMonth === m.id;
                  const monthCount = registry.indexes.byYearMonth?.[m.id]?.length || registry.indexes.byMonth?.[m.id]?.length || 0;
                  const isCurrentRoute = pathname === `/briefing/${m.id}`;

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
                              : monthCount > 0
                              ? "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                              : "text-[var(--text-subtle)] hover:text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          <span className="truncate">{m.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            monthCount > 0
                              ? "bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40"
                              : "bg-[var(--surface-elevated)] text-[var(--text-subtle)] opacity-70"
                          }`}>
                            {monthCount > 0 ? monthCount : "Queued"}
                          </span>
                        </Link>
                      </div>

                      {/* Month Categories Subtree */}
                      {isMonthActive && monthCount > 0 && (
                        <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-amber-800/20 dark:border-amber-600/20 ml-2">
                          <Link
                            href={`/briefing/${m.id}`}
                            className="flex items-center justify-between px-2 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                          >
                            <span>All Month Topics</span>
                            <span className="text-[10px] text-[var(--text-subtle)] font-bold">{monthCount}</span>
                          </Link>

                          {activeCategories.map((catKey) => {
                            const count = categoryCounts[catKey];
                            const label = CATEGORY_DISPLAY_NAMES[catKey] || catKey.replace(/_/g, " ");

                            return (
                              <Link
                                key={catKey}
                                href={`/briefing/${m.id}#category-${catKey}`}
                                onClick={(e) => {
                                  if (pathname === `/briefing/${m.id}`) {
                                    const el = document.getElementById(`category-${catKey}`);
                                    if (el) {
                                      e.preventDefault();
                                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }
                                  }
                                }}
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

        {/* PILLAR 4: REVISION */}
        <div className="space-y-1 pt-2 border-t border-[var(--border-primary)]/80">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] font-bold">
            Revision
          </div>
          {revisionItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href && !pathname.startsWith("/chronology");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-amber-800/15 text-amber-900 dark:text-amber-300 font-bold border-l-3 border-amber-800 dark:border-amber-600"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-800 dark:text-amber-400" : "text-[var(--text-subtle)]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
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
