import React from "react";
import Link from "next/link";
import { CheckCircle2, RotateCcw, AlertTriangle, ArrowRight, BookOpen, Clock } from "lucide-react";
import { SelfRating } from "@/lib/banking-ca/revision-state";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface SessionCompleteViewProps {
  totalPrompts: number;
  ratingCounts: Record<SelfRating, number>;
  reviewedTopics: CanonicalTopic[];
  weakTopics: CanonicalTopic[];
  onRestart: () => void;
}

export function SessionCompleteView({
  totalPrompts,
  ratingCounts,
  reviewedTopics,
  weakTopics,
  onRestart
}: SessionCompleteViewProps) {
  const againCount = ratingCounts.AGAIN || 0;
  const hardCount = ratingCounts.HARD || 0;
  const goodCount = ratingCounts.GOOD || 0;
  const easyCount = ratingCounts.EASY || 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Complete Header Banner */}
      <div className="p-6 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)]">
          Revision Session Complete
        </h2>
        <p className="text-xs text-[var(--text-muted)] font-mono">
          Reviewed {reviewedTopics.length} Topics · {totalPrompts} Recall Prompts Tested
        </p>

        {/* Rating Breakdown Pill Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2 max-w-md mx-auto text-xs font-mono">
          <div className="p-2 rounded-xl bg-red-950/20 border border-red-800/30 text-red-300">
            <span className="block font-bold text-sm">{againCount}</span>
            <span className="text-[10px] opacity-80">Again</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-300">
            <span className="block font-bold text-sm">{hardCount}</span>
            <span className="text-[10px] opacity-80">Hard</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-950/20 border border-blue-800/30 text-blue-300">
            <span className="block font-bold text-sm">{goodCount}</span>
            <span className="text-[10px] opacity-80">Good</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300">
            <span className="block font-bold text-sm">{easyCount}</span>
            <span className="text-[10px] opacity-80">Easy</span>
          </div>
        </div>
      </div>

      {/* Mentor Actionable Follow-Up Plan */}
      <div className="p-6 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4">
        <h3 className="text-sm font-serif font-bold text-[var(--text-primary)] flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Follow-Up Recommendations</span>
        </h3>

        {weakTopics.length > 0 ? (
          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-amber-950/15 border border-amber-800/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Revisit {weakTopics.length} Weak / Hard Topics Tomorrow:</span>
              </div>
              <ul className="space-y-1.5 text-xs font-mono text-[var(--text-primary)] pl-5 list-disc">
                {weakTopics.map(t => (
                  <li key={t.id}>
                    <Link href={`/topics/${t.slug}`} className="hover:text-emerald-400 underline transition-colors">
                      {t.title}
                    </Link>{" "}
                    (~{t.revisionMinutes}m)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)] font-mono">
            🎉 Excellent mastery across all cards in this deck! All prompts recalled accurately.
          </p>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRestart}
            className="w-full sm:w-1/2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Another Deck</span>
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-1/2 py-2.5 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-mono text-xs font-medium text-center transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
