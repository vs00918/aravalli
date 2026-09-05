"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import {
  CheckCircle2,
  Circle,
  Layers,
  Sparkles,
  Zap,
  Info,
  ArrowRight,
  ShieldCheck,
  Target
} from "lucide-react";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function SchemeFlow({ topic, isRead, onToggleRead }: PrimitiveProps) {
  const isP1 = topic.priority.startsWith("P1");
  const facts = topic.mustMemorizeFacts || [];
  const context = topic.knowUnderstandContext || [];
  const overview = topic.whatHappened || [];

  // Separate recap and core parameters
  const { recapFact, regularFacts } = useMemo(() => {
    const facts = topic.mustMemorizeFacts || [];
    let recap: string | null = null;
    const regular: string[] = [];

    for (const f of facts) {
      if (/🎯|\bRecap:/i.test(f)) {
        if (!recap) recap = f;
      } else {
        regular.push(f);
      }
    }

    return { recapFact: recap, regularFacts: regular };
  }, [topic.mustMemorizeFacts]);

  return (
    <article
      id={topic.slug}
      className={`py-6 my-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/40 bg-gradient-to-b from-teal-50/20 via-white dark:via-gray-950 to-white dark:to-gray-950 p-5 md:p-6 space-y-4.5 transition-all shadow-xs ${
        isRead ? "opacity-85" : ""
      }`}
    >
      {/* 1. Header Bar with Metadata Badges & Actions */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[10px] bg-teal-100 text-teal-900 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-300/70 dark:border-teal-800/60 uppercase tracking-wider">
            <Layers className="w-3 h-3 text-teal-700 dark:text-teal-400" />
            <span>SCHEME ARCHITECTURE</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[10px] ${
              isP1
                ? "bg-red-100 text-red-900 dark:bg-red-950/70 dark:text-red-300 border border-red-300/60 dark:border-red-800/50"
                : "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/50"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{isP1 ? "P1 CRITICAL" : "P2 HIGH-YIELD"}</span>
          </span>

          {topic.regulatoryStatus &&
            topic.regulatoryStatus !== "NOTIFIED" &&
            topic.regulatoryStatus !== "IMPLEMENTED" &&
            topic.regulatoryStatus !== "APPROVED" && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-300/60 dark:border-blue-800/50">
                {topic.regulatoryStatus}
              </span>
            )}

          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {formatCleanCategory(topic.primaryCategory)}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleRead(topic.slug)}
            className="hover:text-[var(--text-primary)] transition-colors p-1"
            title={isRead ? "Mark as unread" : "Mark as read"}
          >
            {isRead ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 text-[var(--text-subtle)]" />
            )}
          </button>

          <Link
            href={`/revision?topic=${topic.slug}`}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/70 hover:bg-amber-200 transition-colors"
            title="Practice Active Recall Drill"
          >
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>Drill</span>
          </Link>

          <Link
            href={`/topics/${topic.slug}`}
            className="text-[10px] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
          >
            Focus ↗
          </Link>
        </div>
      </div>

      {/* 2. Title */}
      <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] tracking-tight leading-snug">
        {topic.title}
      </h3>

      {/* 3. Context / Statutory Authority Box (if present) */}
      {(context.length > 0 || overview.length > 0) && (
        <div className="p-3.5 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/30 text-xs text-[var(--text-secondary)] space-y-1.5">
          <div className="flex items-center gap-1.5 font-mono font-bold text-teal-950 dark:text-teal-300 uppercase tracking-wider text-[10px]">
            <Info className="w-3 h-3 text-teal-700 dark:text-teal-400" />
            <span>Why It Matters & Statutory Framework</span>
          </div>
          <div className="space-y-1 font-serif leading-relaxed text-[13px] text-[var(--text-primary)]">
            {[...context, ...overview].map((item, idx) => (
              <div key={idx}>
                <FormattedText text={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Core Parameters & Procedural Ladder */}
      {regularFacts.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-950 dark:text-teal-300 flex items-center gap-1.5">
            <Target className="w-3 h-3 text-teal-700 dark:text-teal-400" />
            <span>Scheme Provisions & Outlay Ladder</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {regularFacts.map((fact, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800/70 flex items-start gap-2.5 text-sm font-serif leading-relaxed text-[var(--text-primary)]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-2 shrink-0" />
                <div className="flex-1">
                  <FormattedText text={fact} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Exam Focus / Takeaways (if present) */}
      {topic.examFocus && topic.examFocus.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs font-serif space-y-1">
          <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-amber-900 dark:text-amber-300">
            Exam Angles & Traps:
          </span>
          <div className="space-y-1 text-[var(--text-primary)]">
            {topic.examFocus.map((focus, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                <FormattedText text={focus} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Single Crisp Recap Banner */}
      {recapFact && (
        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-300/60 dark:border-emerald-800/40 text-xs font-mono text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
          <span className="shrink-0 text-sm">🎯</span>
          <div className="flex-1 font-medium leading-relaxed">
            <FormattedText text={recapFact.replace(/^[•\-\*]*\s*🎯?\s*\**Recap:\**\s*/i, "")} />
          </div>
        </div>
      )}
    </article>
  );
}
