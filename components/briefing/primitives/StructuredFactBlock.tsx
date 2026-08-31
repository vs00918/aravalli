"use client";

import React, { useMemo } from "react";
import { FormattedText } from "@/components/common/FormattedText";
import { ArrowRight } from "lucide-react";

interface StructuredFactBlockProps {
  facts: string[];
  /** When true, renders ONLY the bullet list — used in Brief / non-P1 contexts */
  bulletsOnly?: boolean;
}

interface ParsedMetric {
  value: string;
  label: string;
  rawFact: string;
}

interface ParsedTransition {
  label: string;
  from: string;
  to: string;
  rawFact: string;
}

/**
 * StructuredFactBlock — cognitive-density-aware fact renderer.
 *
 * Rendering contract:
 *   1. Detect before→after transitions (e.g. "12 → 14 calamities").
 *   2. If ≥2 short numeric facts exist, surface a compact metric row.
 *   3. Facts that were already visualised in the metric row or transition row
 *      are EXCLUDED from the bullet list to prevent duplication.
 *   4. Remaining facts render as clean editorial bullets.
 *
 * The goal: each fact appears ONCE in the most useful form.
 */
export function StructuredFactBlock({ facts, bulletsOnly = false }: StructuredFactBlockProps) {
  const { transitions, metrics, remainingBullets } = useMemo(() => {
    if (bulletsOnly) {
      return { transitions: [], metrics: [], remainingBullets: facts };
    }

    const transitions: ParsedTransition[] = [];
    const metrics: ParsedMetric[] = [];
    const visualisedIndices = new Set<number>();

    facts.forEach((fact, i) => {
      // 1. Detect Before → After Transitions
      const transMatch = fact.match(
        /(?:expanded|increased|raised|revised|changed|shifted|grown|extended)\s+(?:from\s+)?([₹\$\d\.,\%\w\s\-]+?)\s+(?:to|-\>|→)\s+([₹\$\d\.,\%\w\s\-]+?)(?:\s*[:,\(]|\s+with|\s+by|$)/i
      );
      if (
        transMatch &&
        transMatch[1].trim().length < 25 &&
        transMatch[2].trim().length < 25 &&
        transitions.length < 2
      ) {
        transitions.push({
          label: fact.split(/[:–—]/)[0]?.replace(/\*\*/g, "").trim() || "Change",
          from: transMatch[1].trim(),
          to: transMatch[2].trim(),
          rawFact: fact,
        });
        visualisedIndices.add(i);
      }
    });

    // 2. Detect high-yield key metrics — only short facts with a currency/percent
    facts.forEach((fact, i) => {
      if (visualisedIndices.has(i)) return;
      if (metrics.length >= 3) return;
      // Only surface if the fact is genuinely short (≤12 words)
      const wordCount = fact.trim().split(/\s+/).length;
      if (wordCount > 12) return;

      const numMatch = fact.match(
        /(?:₹\s*[\d,]+(?:\.\d+)?\s*(?:crore|lakh|cr|trn|bn)?|\$[\d,]+(?:\.\d+)?\s*(?:billion|million|B|M)?|\b\d+(?:\.\d+)?%\b)/i
      );
      if (numMatch) {
        const rawLabel = fact
          .replace(numMatch[0], "")
          .replace(/^[–—\-\s:\*]+|[–—\-\s:\*]+$/g, "")
          .trim();
        if (rawLabel.length > 2 && rawLabel.length < 45) {
          metrics.push({ value: numMatch[0], label: rawLabel, rawFact: fact });
          visualisedIndices.add(i);
        }
      }
    });

    // Only show metric row if we have ≥2 metrics — otherwise facts flow better as bullets
    if (metrics.length < 2) {
      metrics.forEach((m) => visualisedIndices.delete(facts.indexOf(m.rawFact)));
      metrics.length = 0;
    }

    const remainingBullets = facts.filter((_, i) => !visualisedIndices.has(i));
    return { transitions, metrics, remainingBullets };
  }, [facts, bulletsOnly]);

  return (
    <div className="space-y-3">
      {/* 1. BEFORE → AFTER TRANSITION LINE */}
      {transitions.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 py-1 border-b border-amber-200/50 dark:border-amber-900/30 text-xs font-mono">
          {transitions.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2 text-amber-950 dark:text-amber-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400">
                {t.label}:
              </span>
              <span className="line-through opacity-60 font-semibold">{t.from}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-bold">{t.to}</span>
            </div>
          ))}
        </div>
      )}

      {/* 2. COMPACT METRIC ROW — only when ≥2 distinct short metrics exist */}
      {metrics.length >= 2 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 py-2 border-y border-stone-200/60 dark:border-stone-700/40">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="text-base sm:text-lg font-bold font-mono text-amber-950 dark:text-amber-300 tracking-tight leading-none">
                {m.value}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] font-sans uppercase tracking-wide leading-tight">
                <FormattedText text={m.label} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. EDITORIAL BULLET LIST — facts NOT already surfaced above */}
      {remainingBullets.length > 0 && (
        <ul className="space-y-1.5 text-sm sm:text-[15px] font-serif leading-relaxed text-[var(--text-primary)]">
          {remainingBullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-stone-400 dark:text-stone-500 font-bold mt-1 text-xs select-none shrink-0">•</span>
              <span className="flex-1 leading-relaxed">
                <FormattedText text={bullet} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
