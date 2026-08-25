import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Concept } from "@/lib/types";

interface ChapterConceptListProps {
  concepts: Concept[];
}

export function ChapterConceptList({ concepts }: ChapterConceptListProps) {
  if (!concepts || concepts.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 font-mono text-xs">
        No concepts added to this volume yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
          Foundational Concepts ({concepts.length})
        </h2>
      </div>

      <div className="space-y-4">
        {concepts.map((concept, idx) => (
          <div
            id={`concept-${concept.slug}`}
            key={concept.id}
            className="group rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-5 sm:p-6 space-y-3 transition-all hover:border-emerald-500/40 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {concept.title}
                </h3>
              </div>
            </div>

            {/* One-Liner Definition */}
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {concept.oneLiner}
            </p>

            {/* Why It Matters */}
            {concept.whyItMatters && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  Why it matters:
                </span>{" "}
                {concept.whyItMatters}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
