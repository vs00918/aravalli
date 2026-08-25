import React from "react";
import { CheckCircle2, Flame } from "lucide-react";

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
    <section className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
      isP1 
        ? "bg-emerald-950/20 border-emerald-800/40 shadow-sm" 
        : "bg-[var(--surface-primary)] border-[var(--border-primary)]"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`p-1 rounded ${isP1 ? "bg-emerald-900/40 text-emerald-400" : "bg-[var(--surface-elevated)] text-[var(--text-muted)]"}`}>
            {isP1 ? <Flame className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </span>
          <h2 className="text-sm font-serif font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Must Memorize (Core Exam Numbers &amp; Rules)
          </h2>
        </div>
        {isP1 && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-800/60">
            3-Min Core Deck
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
              className="p-3 rounded-xl bg-[var(--surface-primary)]/80 border border-[var(--border-primary)] flex items-start gap-3 text-xs sm:text-sm text-[var(--text-primary)] font-mono leading-relaxed"
            >
              <span className="text-emerald-400 font-bold mt-0.5">•</span>
              <div className="flex-1">
                {parts.length > 1 && parts[1] ? (
                  <>
                    <span className="font-semibold text-emerald-300">{parts[0]}: </span>
                    <span>{parts[1]}</span>
                  </>
                ) : (
                  <span>{fact}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
