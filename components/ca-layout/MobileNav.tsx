"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  BookOpen, 
  RotateCw, 
  Landmark, 
  Calendar, 
  Search, 
  FileText,
  Clock
} from "lucide-react";

interface MobileNavProps {
  totalTopics: number;
  p1Count: number;
  p1Minutes: number;
  changeAlertCount: number;
}

export function MobileNav({ totalTopics, p1Count, p1Minutes, changeAlertCount }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="md:hidden">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-primary)] border-b border-[var(--border-primary)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg">🏦</span>
          <span className="font-serif font-semibold text-sm text-[var(--text-primary)]">
            CA Mentor OS
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Slide-out Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md p-4 space-y-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-800/10 text-emerald-400 font-semibold border border-emerald-800/40"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-[var(--text-subtle)]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Revision Overview in Mobile */}
          <div className="p-4 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Active P1 Deck
              </span>
              <span>{p1Minutes} min</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {p1Count} high-conviction master items ready for today&apos;s study cycle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
