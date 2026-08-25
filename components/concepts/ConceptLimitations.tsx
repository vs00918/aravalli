import React from "react";
import { AlertCircle } from "lucide-react";

interface ConceptLimitationsProps {
  commonMisconceptions?: string | null;
}

export function ConceptLimitations({ commonMisconceptions }: ConceptLimitationsProps) {
  if (!commonMisconceptions) return null;

  return (
    <section id="limitations" className="scroll-mt-20 space-y-3 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
        <AlertCircle className="w-4 h-4" />
        <span>Limitations & Common Misunderstandings</span>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20 p-5 sm:p-6 space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
          What this idea does NOT mean
        </div>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
          {commonMisconceptions}
        </p>
      </div>
    </section>
  );
}
