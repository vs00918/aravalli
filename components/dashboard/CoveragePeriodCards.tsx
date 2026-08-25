import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface CoveragePeriodCardsProps {
  registry: BankingCaMasterRegistry;
}

interface PeriodCardData {
  id: string;
  name: string;
  quarterTag?: string;
  status: "ACTIVE" | "BACKGROUND" | "SCHEDULED" | "UPCOMING";
  topicCount: number;
  batchCount: number;
}

export function CoveragePeriodCards({ registry }: CoveragePeriodCardsProps) {
  const getTopicCount = (monthId: string) => {
    return registry.indexes.byYearMonth?.[monthId]?.length || registry.indexes.byMonth?.[monthId]?.length || 0;
  };

  const periods: PeriodCardData[] = [
    {
      id: "2026-q1",
      name: "JAN–MAR 2026",
      quarterTag: "Q4 Master",
      status: "BACKGROUND",
      topicCount: getTopicCount("2026-01") + getTopicCount("2026-02") + getTopicCount("2026-03"),
      batchCount: 0
    },
    {
      id: "2026-04",
      name: "APRIL 2026",
      status: "SCHEDULED",
      topicCount: getTopicCount("2026-04"),
      batchCount: 0
    },
    {
      id: "2026-05",
      name: "MAY 2026",
      status: "SCHEDULED",
      topicCount: getTopicCount("2026-05"),
      batchCount: 0
    },
    {
      id: "2026-06",
      name: "JUNE 2026",
      status: "SCHEDULED",
      topicCount: getTopicCount("2026-06"),
      batchCount: 0
    },
    {
      id: "2026-07",
      name: "JULY 2026",
      status: "SCHEDULED",
      topicCount: getTopicCount("2026-07"),
      batchCount: 0
    },
    {
      id: "2026-08",
      name: "AUGUST 2026",
      status: "ACTIVE",
      topicCount: getTopicCount("2026-08"),
      batchCount: registry.batches.length
    },
    {
      id: "2026-09",
      name: "SEPTEMBER 2026",
      status: "UPCOMING",
      topicCount: getTopicCount("2026-09"),
      batchCount: 0
    },
    {
      id: "2026-10",
      name: "OCTOBER 2026",
      status: "UPCOMING",
      topicCount: getTopicCount("2026-10"),
      batchCount: 0
    }
  ];

  return (
    <section className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-900 dark:text-amber-400" />
          <h2 className="text-base font-serif font-bold text-[var(--text-primary)]">
            2026 Coverage Periods &amp; Monthly Archives
          </h2>
        </div>
        <Link
          href="/chronology"
          className="text-xs font-mono text-amber-900 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <span>View Chronology Tree</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {periods.map((p) => {
          const isActive = p.status === "ACTIVE";
          const href = p.id.startsWith("2026-q") ? "/chronology" : `/briefing/${p.id}`;

          return (
            <Link
              key={p.id}
              href={href}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] shadow-2xs ${
                isActive
                  ? "bg-amber-100/50 dark:bg-amber-950/30 border-amber-800/40 dark:border-amber-700/50 shadow-xs ring-1 ring-amber-800/20"
                  : "bg-[var(--surface-primary)] border-[var(--border-primary)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                  {p.quarterTag || "2026"}
                </div>
                <div className="font-serif font-bold text-xs text-[var(--text-primary)] leading-tight">
                  {p.name.replace(" 2026", "")}
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-[var(--border-primary)]/60 flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${
                  p.topicCount > 0
                    ? "text-amber-900 dark:text-amber-300"
                    : "text-[var(--text-subtle)]"
                }`}>
                  {p.topicCount > 0 ? `${p.topicCount} Topics` : "Queued"}
                </span>

                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" title="Active Window" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
