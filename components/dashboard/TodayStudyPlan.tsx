import React from "react";
import Link from "next/link";
import { Clock, Zap, ArrowRight, ShieldCheck, Flame } from "lucide-react";

interface TodayStudyPlanProps {
  p1Count: number;
  p1Minutes: number;
}

export function TodayStudyPlan({ p1Count, p1Minutes }: TodayStudyPlanProps) {
  const plans = [
    {
      id: "15-min",
      label: "15 min",
      title: "Sprint Recall",
      desc: "Fast high-conviction P1 drill",
      badge: "High Priority"
    },
    {
      id: "30-min",
      label: "30 min",
      title: "Core Standard",
      desc: "Recommended daily study cycle",
      badge: "Recommended",
      isPrimary: true
    },
    {
      id: "60-min",
      label: "60 min",
      title: "Deep Mastery",
      desc: "Comprehensive multi-tier review",
      badge: "Deep Study"
    },
    {
      id: "all-p1",
      label: `${p1Minutes} min`,
      title: "ALL-P1 Deck",
      desc: `Full ${p1Count} P1 critical topics`,
      badge: "Complete P1"
    }
  ];

  return (
    <section className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-900 dark:text-amber-400" />
          <h2 className="text-base font-serif font-bold text-[var(--text-primary)]">
            Today&apos;s Revision Plan
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-muted)] font-semibold">
          Time-Budgeted Active Recall
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {plans.map((p) => (
          <Link
            key={p.id}
            href={`/revision?deck=${p.id}`}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] shadow-2xs ${
              p.isPrimary
                ? "bg-amber-100/50 dark:bg-amber-950/30 border-amber-800/40 dark:border-amber-700/50 ring-1 ring-amber-800/20 shadow-xs"
                : "bg-[var(--surface-elevated)] border-[var(--border-primary)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-900 dark:text-amber-400">
                  {p.label}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-primary)] text-[var(--text-muted)] border border-[var(--border-primary)] font-semibold">
                  {p.badge}
                </span>
              </div>
              <div className="font-serif font-bold text-sm text-[var(--text-primary)]">
                {p.title}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-tight">
                {p.desc}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-[var(--border-primary)]/60 flex items-center justify-between text-xs font-mono font-bold text-amber-900 dark:text-amber-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                <span>Start Session</span>
              </span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
