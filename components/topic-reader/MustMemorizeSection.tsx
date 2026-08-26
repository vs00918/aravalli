import React from "react";
import { FormattedText } from "@/components/common/FormattedText";

interface MustMemorizeSectionProps {
  facts: string[];
  heading?: string;
  isP1?: boolean;
}

export function MustMemorizeSection({
  facts,
  heading = "KEY FACTS",
  isP1 = false,
}: MustMemorizeSectionProps) {
  if (!facts || facts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3 pt-2">
      <h2 className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase">
        {heading}
      </h2>

      <ul className="space-y-2 text-sm sm:text-[15px] font-serif leading-relaxed text-[var(--text-primary)] pl-1">
        {facts.map((fact, index) => {
          // Parse potential "Key: Value" or "Key -> Value" for clean visual emphasis
          const hasColon = fact.includes(":");
          const parts = hasColon ? fact.split(/:\s*(.+)/) : [fact];

          return (
            <li key={index} className="flex items-start gap-2.5">
              <span className="text-amber-800 dark:text-amber-400 font-bold mt-1 text-xs select-none">
                •
              </span>
              <div className="flex-1 leading-relaxed">
                {parts.length > 1 && parts[1] ? (
                  <>
                    <strong className="font-semibold text-[var(--text-primary)]">
                      <FormattedText text={parts[0]} />:{" "}
                    </strong>
                    <span>
                      <FormattedText text={parts[1]} />
                    </span>
                  </>
                ) : (
                  <span>
                    <FormattedText text={fact} />
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
