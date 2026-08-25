import React from "react";
import { Info } from "lucide-react";
import { FormattedText } from "@/components/common/FormattedText";

interface WhatHappenedSectionProps {
  whatHappened: string[];
}

export function WhatHappenedSection({ whatHappened }: WhatHappenedSectionProps) {
  if (!whatHappened || whatHappened.length === 0) {
    return null;
  }

  return (
    <section className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">
        <Info className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
        <span>What Happened (Factual Orientation)</span>
      </div>
      <div className="space-y-2.5 text-xs sm:text-sm text-[var(--text-primary)] font-sans leading-relaxed">
        {whatHappened.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            <FormattedText text={paragraph} />
          </p>
        ))}
      </div>
    </section>
  );
}
