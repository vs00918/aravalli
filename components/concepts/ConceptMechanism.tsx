import React from "react";
import { Cpu } from "lucide-react";

interface ConceptMechanismProps {
  howItWorks?: string | null;
}

export function ConceptMechanism({ howItWorks }: ConceptMechanismProps) {
  if (!howItWorks) return null;

  return (
    <section id="layer-mechanism" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Cpu className="w-4 h-4" />
        <span>Level 3 · How It Actually Works</span>
      </div>

      <div className="text-slate-800 dark:text-slate-200 font-serif leading-relaxed text-base sm:text-lg space-y-4">
        <p>{howItWorks}</p>
      </div>
    </section>
  );
}
