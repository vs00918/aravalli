import React from "react";
import { Atom } from "lucide-react";

interface ConceptFirstPrinciplesProps {
  firstPrinciples?: string | null;
}

export function ConceptFirstPrinciples({ firstPrinciples }: ConceptFirstPrinciplesProps) {
  if (!firstPrinciples) return null;

  return (
    <section id="layer-first-principles" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Atom className="w-4 h-4" />
        <span>Level 4 · From First Principles</span>
      </div>

      <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-5 sm:p-6 space-y-3">
        <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-serif leading-relaxed">
          {firstPrinciples}
        </p>
      </div>
    </section>
  );
}
