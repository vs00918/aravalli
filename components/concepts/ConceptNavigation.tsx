import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ListTree } from "lucide-react";
import { Concept, Chapter } from "@/lib/types";

interface ConceptNavigationProps {
  currentConcept: Concept;
  chapter: Chapter & { concepts?: Concept[] };
}

export function ConceptNavigation({ currentConcept, chapter }: ConceptNavigationProps) {
  const concepts = (chapter?.concepts ?? []).sort((a, b) => a.order - b.order);
  const currentIndex = concepts.findIndex((c) => c.id === currentConcept.id);

  const prevConcept = currentIndex > 0 ? concepts[currentIndex - 1] : null;
  const nextConcept = currentIndex >= 0 && currentIndex < concepts.length - 1 ? concepts[currentIndex + 1] : null;

  return (
    <nav aria-label="Chapter concept navigation" className="pt-10 border-t border-slate-200/80 dark:border-slate-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous Concept */}
        {prevConcept ? (
          <Link
            href={`/concepts/${prevConcept.slug}`}
            className="group flex flex-col p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/60 dark:bg-[#0f1520] hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center space-x-1 text-xs font-mono text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Concept</span>
            </div>
            <div className="text-sm font-serif font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors pt-1">
              {prevConcept.title}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next Concept */}
        {nextConcept ? (
          <Link
            href={`/concepts/${nextConcept.slug}`}
            className="group flex flex-col items-end p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/60 dark:bg-[#0f1520] hover:border-emerald-500/40 transition-colors text-right"
          >
            <div className="flex items-center space-x-1 text-xs font-mono text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <span>Next Concept</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm font-serif font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors pt-1">
              {nextConcept.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Return to Chapter Overview */}
      <div className="text-center pt-6">
        <Link
          href={`/chapters/${chapter.slug}`}
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>Return to Volume {String(chapter.order).padStart(2, "0")} ({chapter.title})</span>
        </Link>
      </div>
    </nav>
  );
}
