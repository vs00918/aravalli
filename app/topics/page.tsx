import React from "react";
import Link from "next/link";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { BookOpen, Clock, ArrowRight, Zap, Layers } from "lucide-react";

export const dynamic = "force-static";

export default function TopicsDirectoryPage() {
  const registry = getBankingCaRegistry();
  const topics = Object.values(registry.topics);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-900 dark:text-amber-400 font-bold uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Canonical Knowledge Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
            Canonical Current Affairs ({topics.length} Topics)
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono">
            Deduplicated, single-event knowledge nodes compiled across all coaching batches.
          </p>
        </div>

        <Link
          href="/briefing/2026-08"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-mono text-xs font-bold transition-all shadow-xs"
        >
          <Layers className="w-4 h-4" />
          <span>Open August Briefing Stream</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => {
          const isP1 = topic.priority.startsWith("P1");
          const isP2 = topic.priority === "P2_HIGH";

          return (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className={`group p-5 rounded-2xl bg-[var(--surface-primary)] hover:bg-[var(--surface-hover)] border transition-all flex flex-col justify-between shadow-2xs ${
                isP1
                  ? "border-amber-800/40 dark:border-amber-700/40"
                  : "border-[var(--border-primary)]"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] font-semibold border border-[var(--border-primary)]">
                    {topic.primaryInstitution}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    isP1
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50"
                      : isP2
                      ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]"
                      : "bg-[var(--surface-elevated)] text-[var(--text-subtle)] border border-[var(--border-primary)]"
                  }`}>
                    {topic.priority.replace(/_/g, " ")}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors leading-snug">
                  {topic.title}
                </h2>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-primary)] flex items-center justify-between text-[11px] font-mono text-[var(--text-subtle)]">
                <span>~{topic.revisionMinutes}m revision</span>
                <span className="inline-flex items-center gap-1 text-amber-900 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  Deep Reader <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
