import React from "react";
import { BookOpen } from "lucide-react";

interface UnderstandSectionProps {
  context: string[];
}

export function UnderstandSection({ context }: UnderstandSectionProps) {
  if (!context || context.length === 0) {
    return null;
  }

  return (
    <section className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3">
      <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
        <BookOpen className="w-4 h-4 text-blue-400" />
        <span>Understand &amp; Policy Rationale</span>
      </div>

      <div className="space-y-2 text-xs sm:text-sm text-[var(--text-muted)] font-sans leading-relaxed">
        {context.map((text, index) => (
          <p key={index} className="leading-relaxed">
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
