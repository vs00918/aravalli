import React from "react";
import { Lightbulb, Eye } from "lucide-react";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface ConceptIntuitionProps {
  intuition?: string | null;
  example?: string | null;
}

export function ConceptIntuition({ intuition, example }: ConceptIntuitionProps) {
  if (!intuition) return null;

  return (
    <section id="layer-intuition" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Lightbulb className="w-4 h-4" />
        <span>Level 2 · Build the Mental Model</span>
      </div>

      <MarkdownContent content={intuition} />

      {example && (
        <div className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Eye className="w-3.5 h-3.5" />
            <span>Concrete Thought Experiment & Analogy Boundary</span>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
            <MarkdownContent content={example} />
          </div>
        </div>
      )}
    </section>
  );
}
