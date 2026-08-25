import React from "react";
import { Eye } from "lucide-react";

interface ConceptIntuitionProps {
  intuition?: string | null;
  example?: string | null;
}

export function ConceptIntuition({ intuition, example }: ConceptIntuitionProps) {
  if (!intuition) return null;

  return (
    <section id="layer-intuition" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Eye className="w-4 h-4" />
        <span>Level 2 · Build the Intuition</span>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-serif leading-relaxed text-base sm:text-lg space-y-4">
        <p>{intuition}</p>

        {example && (
          <div className="my-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/60 dark:bg-[#0f1520] p-4 sm:p-5 not-prose space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Concrete Observation
            </div>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
              {example}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
