import React from "react";
import Link from "next/link";
import { getBankingCaRegistry, getExamProfiles, getDefaultExamProfile } from "@/lib/banking-ca/data";
import { Calendar, ArrowRight, Clock, Target, Layers, Sparkles } from "lucide-react";

export const dynamic = "force-static";

const MONTH_NAMES: Record<string, string> = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December"
};

export default function ChronologyPage() {
  const registry = getBankingCaRegistry();
  const examProfiles = getExamProfiles();
  const defaultProfile = getDefaultExamProfile();

  // Extract all distinct indexed months across topics
  const indexedMonths = Object.keys(registry.indexes.byYearMonth || registry.indexes.byMonth || {}).sort().reverse();

  // Group by Year
  const yearTree: Record<string, string[]> = {};
  for (const ym of indexedMonths) {
    const [year] = ym.split("-");
    if (!yearTree[year]) yearTree[year] = [];
    yearTree[year].push(ym);
  }

  const years = Object.keys(yearTree).sort().reverse();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-800 dark:text-emerald-400 font-bold">
          <Calendar className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <span>Timeline Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
          Chronology &amp; Month-First Explorer
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Scalable multi-year current affairs archive. Filter and explore events by chronological occurrence month and target exam eligibility windows.
        </p>
      </div>

      {/* Target Exam Profiles View Bar */}
      <section className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] font-semibold">
            <Target className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <span>Configured Exam Target Profiles ({examProfiles.length})</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800/40">
            Active: {defaultProfile.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {examProfiles.map((prof) => (
            <div
              key={prof.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                prof.isDefault
                  ? "bg-emerald-100/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/40"
                  : "bg-[var(--surface-elevated)] border-[var(--border-primary)]"
              }`}
            >
              <div>
                <div className="text-xs font-serif font-bold text-[var(--text-primary)]">
                  {prof.name}
                </div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                  Window: {prof.windowStartMonth} → {prof.windowEndMonth}
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-subtle)] leading-relaxed">
                {prof.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Year-by-Year Chronological Directory */}
      <div className="space-y-8">
        {years.map((year) => (
          <section key={year} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-primary)]">
              <span className="text-xl font-serif font-bold text-[var(--text-primary)]">
                Year {year}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                ({yearTree[year].length} Active Months)
              </span>
            </div>

            <div className="space-y-4">
              {yearTree[year].map((ym) => {
                const [, monthNum] = ym.split("-");
                const monthName = MONTH_NAMES[monthNum] || ym;
                const topicIds = registry.indexes.byYearMonth?.[ym] || registry.indexes.byMonth?.[ym] || [];
                const topics = topicIds.map(id => registry.topics[id]).filter(Boolean);
                const p1Count = topics.filter(t => t.priority.startsWith("P1")).length;
                const p2Count = topics.filter(t => t.priority === "P2_HIGH").length;
                const p3Count = topics.filter(t => t.priority === "P3_MODERATE").length;
                const totalMinutes = topics.reduce((acc, t) => acc + t.revisionMinutes, 0);

                const isInActiveWindow = ym >= defaultProfile.windowStartMonth && ym <= defaultProfile.windowEndMonth;

                return (
                  <div
                    key={ym}
                    className="p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                            {monthName} {year}
                          </h2>
                          {isInActiveWindow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40">
                              Active Exam Window
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-200 dark:bg-slate-900 text-stone-700 dark:text-slate-400 border border-stone-300 dark:border-slate-700/40">
                              Historical Background CA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                          {topicIds.length} Canonical Events · ~{totalMinutes} min Total Study Load
                        </p>
                      </div>

                      {/* Tier Badges */}
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 font-bold">
                          {p1Count} P1
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40 font-bold">
                          {p2Count} P2
                        </span>
                        <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-slate-900 text-stone-800 dark:text-slate-400 border border-stone-300 dark:border-slate-700/40 font-bold">
                          {p3Count} P3
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Navigation */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[var(--border-primary)]">
                      <Link
                        href={`/search?month=${ym}`}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>Explore {monthName} in Search</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/search?month=${ym}&priority=P1_CRITICAL_DEEP`}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:text-emerald-800 dark:hover:text-emerald-400 font-mono text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <span>View {p1Count} P1 Topics</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
