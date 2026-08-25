import React from "react";
import { AlertCircle } from "lucide-react";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface ConceptLimitationsProps {
  commonMisconceptions?: string | null;
}

export function ConceptLimitations({ commonMisconceptions }: ConceptLimitationsProps) {
  if (!commonMisconceptions) return null;

  return (
    <section id="limitations" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
        <AlertCircle className="w-4 h-4" />
        <span>Limitations, Misconceptions & Self-Test Audit</span>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1520] p-6 space-y-4 shadow-sm">
        <MarkdownContent content={commonMisconceptions} />
      </div>
    </section>
  );
}
