import React from "react";
import { Lightbulb } from "lucide-react";

interface ConceptCoreIdeaProps {
  oneLiner: string;
}

export function ConceptCoreIdea({ oneLiner }: ConceptCoreIdeaProps) {
  return (
    <section id="layer-core-idea" className="scroll-mt-20 space-y-3 pt-6">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Lightbulb className="w-4 h-4" />
        <span>Level 1 · The Core Idea</span>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-6">
        <p className="text-base sm:text-lg text-slate-900 dark:text-slate-100 font-serif leading-relaxed">
          {oneLiner}
        </p>
      </div>
    </section>
  );
}
