import React from "react";
import { BookOpen } from "lucide-react";
import { SourceConcept } from "@/lib/types";

interface ConceptSourcesProps {
  sources?: SourceConcept[];
}

export function ConceptSources({ sources = [] }: ConceptSourcesProps) {
  if (!sources || sources.length === 0) {
    return (
      <section id="sources" className="scroll-mt-20 space-y-3 pt-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
          <BookOpen className="w-4 h-4" />
          <span>Source Provenance</span>
        </div>
        <p className="text-xs font-mono text-slate-400 italic">
          First-principles scientific synthesis from established standard literature. Primary research citations will be linked here as literature ingestion proceeds.
        </p>
      </section>
    );
  }

  return (
    <section id="sources" className="scroll-mt-20 space-y-3 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
        <BookOpen className="w-4 h-4" />
        <span>Sources & Citations</span>
      </div>

      <div className="space-y-2">
        {sources.map((sc, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f1520] text-xs font-mono"
          >
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {sc.source?.title}
            </span>
            {sc.source?.author && (
              <span className="text-slate-500"> — {sc.source.author}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
