import React from "react";
import { Binary } from "lucide-react";
import { MathBlock } from "@/components/ui/MathBlock";

interface ConceptMathematicsProps {
  mathematicalModel?: string | null;
}

export function ConceptMathematics({ mathematicalModel }: ConceptMathematicsProps) {
  if (!mathematicalModel) return null;

  return (
    <section id="layer-mathematics" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Binary className="w-4 h-4" />
        <span>Level 5 · The Mathematics</span>
      </div>

      <div className="space-y-4">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans">
          The mathematical representation describes the quantitative relationships and invariants governing this phenomenon:
        </p>

        {/* KaTeX Math Block */}
        <MathBlock math={mathematicalModel} />
      </div>
    </section>
  );
}
