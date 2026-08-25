"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  RotateCw, 
  Landmark, 
  Calendar, 
  Search, 
  FileText,
  Clock,
  AlertCircle
} from "lucide-react";

interface SidebarNavProps {
  totalTopics: number;
  p1Count: number;
  p1Minutes: number;
  changeAlertCount: number;
}

export function SidebarNav({ totalTopics, p1Count, p1Minutes, changeAlertCount }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/topics", label: "Canonical Topics", icon: BookOpen, badge: totalTopics.toString() },
    { href: "/revision", label: "Revision Hub", icon: RotateCw, badge: `${p1Minutes}m` },
    { href: "/institutions", label: "Institutions", icon: Landmark },
    { href: "/chronology", label: "Chronology", icon: Calendar },
    { href: "/sources", label: "Sources & Audits", icon: FileText },
    { href: "/search", label: "Search Index", icon: Search },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-[var(--border-primary)] bg-[var(--surface-primary)] min-h-[calc(100vh-4rem)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border-primary)]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-700/20 border border-emerald-600/30 flex items-center justify-center text-emerald-400 font-serif font-bold text-lg group-hover:scale-105 transition-transform">
            🏦
          </div>
          <div>
            <div className="font-serif font-semibold text-sm tracking-tight text-[var(--text-primary)]">
              CA Mentor OS
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              SBI & IBPS PO Mains
            </div>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-subtle)] font-bold">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-emerald-800/10 text-emerald-400 border-l-2 border-emerald-500 font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-[var(--text-subtle)]"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Revision Status Widget */}
      <div className="p-4 m-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <Clock className="w-3.5 h-3.5" /> P1 Study Deck
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-800/50">
            {p1Minutes} min
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-subtle)] leading-relaxed">
          {p1Count} high-conviction master topics active for today&apos;s cycle.
        </div>
        {changeAlertCount > 0 && (
          <div className="pt-2 border-t border-[var(--border-primary)] flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{changeAlertCount} Change-Sensitive alert</span>
          </div>
        )}
      </div>

      {/* Exam Countdown / Footer */}
      <div className="p-3 border-t border-[var(--border-primary)] text-center text-[10px] font-mono text-[var(--text-subtle)]">
        Target: SBI PO (Sep 2026) · IBPS PO (Oct 2026)
      </div>
    </aside>
  );
}
