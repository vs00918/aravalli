import React from "react";
import { Compass } from "lucide-react";

interface ConceptWhyItMattersProps {
  whyItMatters?: string | null;
}

export function ConceptWhyItMatters({ whyItMatters }: ConceptWhyItMattersProps) {
  if (!whyItMatters) return null;

  return (
    <section id="why-it-matters" className="scroll-mt-20 space-y-3 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-slate-300 font-bold">
        <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>Why It Matters</span>
      </div>

      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
        {whyItMatters}
      </p>
    </section>
  );
}
