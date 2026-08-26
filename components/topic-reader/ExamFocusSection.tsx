import React from "react";
import { FormattedText } from "@/components/common/FormattedText";

interface ExamFocusSectionProps {
  examFocus: string[];
  heading?: string;
}

export function ExamFocusSection({
  examFocus,
  heading = "EXAM TAKEAWAY"
}: ExamFocusSectionProps) {
  if (!examFocus || examFocus.length === 0) {
    return null;
  }

  return (
    <section className="p-4 sm:p-5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-2 mt-4 select-none">
      <div className="text-xs font-mono font-bold tracking-wider text-amber-900 dark:text-amber-300 uppercase">
        {heading}
      </div>

      <div className="space-y-1.5 text-xs sm:text-sm text-[var(--text-primary)] font-serif leading-relaxed">
        {examFocus.map((focus, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-amber-800 dark:text-amber-400 font-bold select-none">•</span>
            <div>
              <FormattedText text={focus} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
