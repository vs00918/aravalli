import React from "react";
import { Compass } from "lucide-react";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

interface ConceptFirstPrinciplesProps {
  firstPrinciples?: string | null;
}

export function ConceptFirstPrinciples({ firstPrinciples }: ConceptFirstPrinciplesProps) {
  if (!firstPrinciples) return null;

  return (
    <section id="layer-first-principles" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Compass className="w-4 h-4" />
        <span>Level 4 · From First Principles</span>
      </div>

      <MarkdownContent content={firstPrinciples} />
    </section>
  );
}
