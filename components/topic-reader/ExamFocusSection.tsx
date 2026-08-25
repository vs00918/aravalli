import React from "react";
import { Target } from "lucide-react";
import { FormattedText } from "@/components/common/FormattedText";

interface ExamFocusSectionProps {
  examFocus: string[];
  priority: string;
  category: string;
}

export function ExamFocusSection({ examFocus }: ExamFocusSectionProps) {
  if (!examFocus || examFocus.length === 0) {
    return null;
  }

  return (
    <section className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
        <Target className="w-4 h-4 text-amber-800 dark:text-amber-400" />
        <span>Exam Focus &amp; Tested Angles</span>
      </div>

      <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] font-sans leading-relaxed">
        {examFocus.map((focus, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="text-amber-700 dark:text-amber-400 font-bold">•</span>
            <span>
              <FormattedText text={focus} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
