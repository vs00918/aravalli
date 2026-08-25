import React from "react";
import { BookOpen, Flame, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface KnowledgeOverviewProps {
  summary: BankingCaMasterRegistry["summary"];
}

export function KnowledgeOverview({ summary }: KnowledgeOverviewProps) {
  const cards = [
    {
      title: "Total Canonical Topics",
      value: summary.totalCanonicalTopics,
      subtitle: "Deduplicated across all feeds",
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-950/20 border-blue-800/30"
    },
    {
      title: "Active P1 Master Deck",
      value: `${summary.activeP1Count} Topics`,
      subtitle: `${summary.activeP1RevisionMinutes} min total core study`,
      icon: Flame,
      color: "text-emerald-400",
      bg: "bg-emerald-950/20 border-emerald-800/30"
    },
    {
      title: "P2 High-Yield Items",
      value: summary.totalP2Count,
      subtitle: "Key indicators, acts & schemes",
      icon: Sparkles,
      color: "text-amber-400",
      bg: "bg-amber-950/20 border-amber-800/30"
    },
    {
      title: "P3 Quick Factoids",
      value: summary.totalP3Count,
      subtitle: "One-liners & quick scan items",
      icon: CheckCircle2,
      color: "text-slate-400",
      bg: "bg-slate-900/30 border-slate-700/30"
    }
  ];

  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="sr-only">Knowledge Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className={`p-4 rounded-xl border ${c.bg} flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-150`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--text-muted)] font-medium">
                  {c.title}
                </span>
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
                  {c.value}
                </div>
                <div className="text-[11px] text-[var(--text-subtle)] mt-1 font-mono">
                  {c.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
