import React from "react";
import { Target } from "lucide-react";

interface ExamFocusSectionProps {
  examFocus: string[];
  priority: string;
  category: string;
}

export function ExamFocusSection({ examFocus, priority, category }: ExamFocusSectionProps) {
  if (!examFocus || examFocus.length === 0) {
    return null;
  }

  return (
    <section className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
        <Target className="w-4 h-4 text-amber-400" />
        <span>Exam Focus &amp; Tested Angles</span>
      </div>

      <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-primary)] font-sans leading-relaxed">
        {examFocus.map((focus, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <span>{focus}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
