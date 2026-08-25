import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, Zap, CheckCircle2, Clock } from "lucide-react";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface RapidRevisionSheetsProps {
  registry: BankingCaMasterRegistry;
}

export function RapidRevisionSheets({ registry }: RapidRevisionSheetsProps) {
  const summary = registry.summary;

  const sheets = [
    {
      month: "August 2026",
      monthId: "2026-08",
      topicsCount: 67,
      drillsCount: 118,
      studyMinutes: 51,
      status: "ACTIVE"
    },
    {
      month: "July 2026",
      monthId: "2026-07",
      topicsCount: 0,
      drillsCount: 0,
      studyMinutes: 0,
      status: "SCHEDULED"
    },
    {
      month: "June 2026",
      monthId: "2026-06",
      topicsCount: 0,
      drillsCount: 0,
      studyMinutes: 0,
      status: "SCHEDULED"
    },
    {
      month: "May 2026",
      monthId: "2026-05",
      topicsCount: 0,
      drillsCount: 0,
      studyMinutes: 0,
      status: "SCHEDULED"
    }
  ];

  return (
    <section className="p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4 shadow-sm select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-900 dark:text-amber-400" />
          <h2 className="text-base font-serif font-bold text-[var(--text-primary)]">
            Section 11 · Rapid Revision Sheets
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-muted)] font-semibold">
          High-Yield Fact Drills
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sheets.map((s) => {
          const isActive = s.status === "ACTIVE";

          return (
            <div
              key={s.monthId}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                isActive
                  ? "bg-amber-100/40 dark:bg-amber-950/20 border-amber-800/30 dark:border-amber-700/40 shadow-xs"
                  : "bg-[var(--surface-elevated)] border-[var(--border-primary)] opacity-70"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[var(--text-primary)]">
                    {s.month}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40"
                      : "bg-[var(--surface-primary)] text-[var(--text-subtle)]"
                  }`}>
                    {isActive ? "Ready" : "Queued"}
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  {isActive
                    ? `${s.topicsCount} Topics · ${s.drillsCount} Drills`
                    : "Scheduled for ingestion"}
                </p>
              </div>

              {isActive ? (
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-primary)]">
                  <Link
                    href={`/briefing/${s.monthId}`}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[var(--surface-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[11px] font-mono text-[var(--text-primary)] font-semibold text-center transition-colors"
                  >
                    Read Stream
                  </Link>
                  <Link
                    href="/revision"
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-white text-[11px] font-mono font-bold text-center transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>Drill</span>
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-[var(--border-primary)] text-[11px] font-mono text-[var(--text-subtle)]">
                  Awaiting source release
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
