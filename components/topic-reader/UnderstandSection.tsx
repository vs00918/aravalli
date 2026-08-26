import React from "react";
import { FormattedText } from "@/components/common/FormattedText";

interface UnderstandSectionProps {
  context: string[];
  heading?: string;
}

export function UnderstandSection({
  context,
  heading = "WHY IT MATTERS"
}: UnderstandSectionProps) {
  if (!context || context.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3 pt-2">
      <h2 className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase">
        {heading}
      </h2>

      <div className="space-y-3 text-sm sm:text-[15px] text-[var(--text-primary)] font-serif leading-relaxed">
        {context.map((text, index) => (
          <p key={index} className="leading-relaxed">
            <FormattedText text={text} />
          </p>
        ))}
      </div>
    </section>
  );
}
