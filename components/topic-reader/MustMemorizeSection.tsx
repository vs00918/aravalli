import React from "react";
import { CheckCircle2, Flame } from "lucide-react";
import { FormattedText } from "@/components/common/FormattedText";

interface MustMemorizeSectionProps {
  facts: string[];
  priority: string;
}

export function MustMemorizeSection({ facts, priority }: MustMemorizeSectionProps) {
  if (!facts || facts.length === 0) {
    return null;
  }

  const isP1 = priority.startsWith("P1");

  return (
    <section
      className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-sm ${
        isP1
          ? "bg-emerald-100/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/40"
          : "bg-[var(--surface-primary)] border-[var(--border-primary)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`p-1 rounded ${
              isP1
                ? "bg-emerald-200/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/40"
                : "bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]"
            }`}
          >
            {isP1 ? <Flame className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </span>
          <h2 className="text-sm font-serif font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Must Memorize (Core Exam Numbers &amp; Rules)
          </h2>
        </div>
        {isP1 && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800/60">
            High-Conviction Fact Deck
          </span>
        )}
      </div>

      <ul className="space-y-2.5">
        {facts.map((fact, index) => {
          // Parse potential "Key: Value" or "Key -> Value" for clean visual separation
          const hasColon = fact.includes(":");
          const parts = hasColon ? fact.split(/:\s*(.+)/) : [fact];

          return (
            <li
              key={index}
              className="p-3 sm:p-3.5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] flex items-start gap-3 text-xs sm:text-sm text-[var(--text-primary)] font-sans leading-relaxed shadow-xs"
            >
              <span className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5 text-base leading-none">•</span>
              <div className="flex-1">
                {parts.length > 1 && parts[1] ? (
                  <>
                    <span className="font-semibold text-emerald-900 dark:text-emerald-300 font-serif">
                      <FormattedText text={parts[0]} />:{" "}
                    </span>
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
