import React from "react";
import { Target } from "lucide-react";

interface ExamFocusSectionProps {
  examFocus: string[];
  priority: string;
  category: string;
}

export function ExamFocusSection({ examFocus, priority, category }: ExamFocusSectionProps) {
  const isP1 = priority.startsWith("P1");

  return (
    <section className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
        <Target className="w-4 h-4 text-amber-400" />
        <span>Exam Focus &amp; Tested Angles</span>
      </div>

      <div className="space-y-2 text-xs sm:text-sm text-[var(--text-muted)] font-sans leading-relaxed">
        {examFocus && examFocus.length > 0 ? (
          <ul className="space-y-1.5">
            {examFocus.map((focus, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="leading-relaxed">
            {isP1 
              ? `High-priority ${category.replace(/_/g, " ")} note for SBI PO / IBPS PO Mains. Focus on exact threshold numbers, mandatory compliance dates, and institutional authority.`
              : `Important ${category.replace(/_/g, " ")} factual item. Pay close attention to numerical values, scheme outlays, and apex appointments.`}
          </p>
        )}
      </div>
    </section>
  );
}
