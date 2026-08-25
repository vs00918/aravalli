import React from "react";
import Link from "next/link";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { Calendar, ArrowRight } from "lucide-react";

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
          Chronology &amp; Timeline
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Rolling 6-month exam window starting from April 2026.
        </p>
      </div>

      <div className="space-y-4">
        {months.map((month) => {
          const topicIds = registry.indexes.byMonth[month] || [];
          return (
            <div
              key={month}
              className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-bold text-base text-[var(--text-primary)]">
                  {month} (August 2026)
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)]">
                  {topicIds.length} Canonical Events
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                Includes all CGB Mentors and Smartkeeda deduplicated items.
              </div>
              <Link
                href={`/topics?month=${month}`}
                className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300"
              >
                <span>Explore {month} Archive</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
