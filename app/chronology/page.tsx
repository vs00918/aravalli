import React from "react";
import Link from "next/link";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { Calendar, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export const dynamic = "force-static";

export default function ChronologyPage() {
  const registry = getBankingCaRegistry();
  const months = Object.keys(registry.indexes.byMonth).sort().reverse();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <Calendar className="w-4 h-4" />
          <span>Timeline View</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Chronology &amp; Timeline Exploration
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Rolling exam window archives starting from April 2026.
        </p>
      </div>

      <div className="space-y-4">
        {months.map((month) => {
          const topicIds = registry.indexes.byMonth[month] || [];
          const topics = topicIds.map(id => registry.topics[id]).filter(Boolean);
          const p1Count = topics.filter(t => t.priority.startsWith('P1')).length;
          const p2Count = topics.filter(t => t.priority === 'P2_HIGH').length;
          const p3Count = topics.filter(t => t.priority === 'P3_MODERATE').length;
          const totalMinutes = topics.reduce((acc, t) => acc + t.revisionMinutes, 0);

          return (
            <div
              key={month}
              className="p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                    {month} (August 2026 Batch Archive)
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {topicIds.length} Canonical Events · ~{totalMinutes} min Total Study Load
                  </p>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-bold">
                    {p1Count} P1
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
                    {p2Count} P2
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700/40">
                    {p3Count} P3
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[var(--border-primary)]">
                <Link
                  href={`/search?month=${month}`}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>Explore {month} in Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/search?month=${month}&priority=P1_CRITICAL_DEEP`}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-muted)] hover:text-emerald-400 font-mono text-xs transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <span>View {p1Count} P1 Topics</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
