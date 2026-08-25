import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Flame } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface TodaysRevisionDeckProps {
  p1Topics: CanonicalTopic[];
  totalMinutes: number;
}

export function TodaysRevisionDeck({ p1Topics, totalMinutes }: TodaysRevisionDeckProps) {
  return (
    <section className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-primary)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40">
              <Flame className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-serif font-bold text-[var(--text-primary)]">
              Today&apos;s Core Study Deck (P1 Master Items)
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Strictly high-conviction topics with disproportionate exam weight for SBI PO / IBPS PO Mains.
          </p>
        </div>

        {/* Time Badge and Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-300 dark:border-emerald-800/40">
            <Clock className="w-3.5 h-3.5" />
            <span>{totalMinutes} min Total</span>
          </div>
          <Link
            href="/revision"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white transition-colors shadow-sm"
          >
            <span>Start Revision</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* P1 Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {p1Topics.map((topic, index) => {
          const rawFact = topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0
            ? topic.mustMemorizeFacts[0]
            : (topic.whatHappened && topic.whatHappened.length > 0 ? topic.whatHappened[0] : "");

          const cleanFact = rawFact.replace(/\*\*/g, "").replace(/`/g, "").trim();

          return (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="group p-4 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] hover:border-emerald-600/50 transition-all duration-150 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-2.5">
                {/* Card Meta Header */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-100/90 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800/40">
                    #{index + 1} · {topic.primaryInstitution}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--text-muted)] font-semibold">
                    <Clock className="w-3 h-3" /> ~{topic.revisionMinutes} min
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-semibold text-sm sm:text-base text-[var(--text-primary)] group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                  {topic.title}
                </h3>

                {/* Core Fact Preview */}
                {cleanFact && (
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed font-sans">
                    • {cleanFact}
                  </p>
                )}
              </div>

              {/* Status & Category Badges */}
              <div className="mt-4 pt-3 border-t border-[var(--border-primary)]/60 flex items-center justify-between text-[10px] font-mono text-[var(--text-subtle)]">
                <span className="uppercase tracking-wider font-semibold">
                  {topic.primaryCategory.replace(/_/g, " ")}
                </span>
                {topic.regulatoryStatus === "DRAFT" && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40">
                    DRAFT
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
