"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  Circle,
  FileText,
  ShieldCheck,
  Calendar,
  Sparkles
} from "lucide-react";
import { StructuredFactBlock } from "./StructuredFactBlock";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function DeepBrief({ topic, isRead, onToggleRead }: PrimitiveProps) {
  const isP1 = topic.priority.startsWith("P1");

  // Determine Orientation, Why It Matters, and Key Rules
  const { orientationParagraphs, whyItMattersParagraphs, distinctMemorizeFacts } = useMemo(() => {
    let orientation: string[] = [];
    let whyItMatters: string[] = topic.knowUnderstandContext || [];
    let memoFacts: string[] = topic.mustMemorizeFacts || [];

    if (topic.whatHappened && topic.whatHappened.length > 0) {
      orientation = topic.whatHappened;
    } else if (memoFacts.length > 0) {
      // If whatHappened is empty, use the first substantive fact as orientation
      orientation = [memoFacts[0]];
      memoFacts = memoFacts.slice(1);
    }

    // Filter memoFacts to exclude items that are identical to orientation or whyItMatters
    const orientationNorm = new Set(
      [...orientation, ...whyItMatters].map((s) => s.toLowerCase().replace(/[^a-z0-9]/g, ""))
    );

    const distinct = memoFacts.filter((fact) => {
      const clean = fact.toLowerCase().replace(/[^a-z0-9]/g, "");
      return !orientationNorm.has(clean);
    });

    return {
      orientationParagraphs: orientation,
      whyItMattersParagraphs: whyItMatters,
      distinctMemorizeFacts: distinct
    };
  }, [topic.whatHappened, topic.knowUnderstandContext, topic.mustMemorizeFacts]);

  // Filter examFocus to omit exact duplicates of facts already surfaced
  const filteredExamFocus = useMemo(() => {
    if (!topic.examFocus || topic.examFocus.length === 0) return [];
    const allSurfaced = [
      ...orientationParagraphs,
      ...whyItMattersParagraphs,
      ...distinctMemorizeFacts
    ].map((f) => f.toLowerCase().replace(/[^a-z0-9]/g, ""));

    return topic.examFocus.filter((focus) => {
      const cleanFocus = focus.toLowerCase().replace(/[^a-z0-9]/g, "");
      // If it contains an explicit exam angle/trap indicator, always preserve it
      if (/\b(trap|note|watch out|caution|key distinction|eligible|ineligible|tenure|limit)\b/i.test(focus)) {
        return true;
      }
      const isDuplicated = allSurfaced.some(
        (f) => f.includes(cleanFocus) || (cleanFocus.length > 20 && f.length > 20 && (cleanFocus.includes(f) || f.includes(cleanFocus)))
      );
      return !isDuplicated;
    });
  }, [topic.examFocus, orientationParagraphs, whyItMattersParagraphs, distinctMemorizeFacts]);

  return (
    <article
      id={topic.slug}
      className={`py-8 first:pt-3 space-y-4.5 transition-opacity ${
        isRead ? "opacity-85" : ""
      }`}
    >
      {/* Top Metadata & Controls Bar */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-red-100/80 dark:bg-red-950/40 text-red-900 dark:text-red-300 border border-red-300/70 dark:border-red-800/40">
            <Sparkles className="w-3 h-3 text-red-700 dark:text-red-400" />
            <span>{isP1 ? "P1 CRITICAL" : "P2 DEEP"}</span>
          </span>
          {topic.regulatoryStatus && topic.regulatoryStatus !== 'NOTIFIED' && topic.regulatoryStatus !== 'IMPLEMENTED' && topic.regulatoryStatus !== 'APPROVED' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-400/80 dark:border-amber-700/60">
              STATUS: {topic.regulatoryStatus}
            </span>
          )}
          <span className="uppercase tracking-wider font-semibold text-[11px] text-[var(--text-muted)]">
            {formatCleanCategory(topic.primaryCategory)}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleRead(topic.slug)}
            className="hover:text-[var(--text-primary)] transition-colors"
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
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/40 hover:bg-amber-200/80 transition-colors"
            title="Practice Active Recall Drill"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Drill</span>
          </Link>

          <Link
            href={`/topics/${topic.slug}`}
            className="text-[11px] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
            title="Open single topic focus reader"
          >
            Focus ↗
          </Link>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] leading-tight tracking-tight">
          {topic.title}
        </h3>
        {topic.subtitle && (
          <p className="text-sm text-[var(--text-muted)] mt-1.5 font-serif italic">
            {topic.subtitle}
          </p>
        )}
        {topic.memoryAnchor && (
          <div className="flex items-center gap-2 pt-0.5 text-xs font-mono text-amber-900/90 dark:text-amber-300/90 tracking-wide select-none">
            <span className="font-bold text-amber-700 dark:text-amber-400">⚡ ANCHOR:</span>
            <span className="font-medium tracking-wider">{topic.memoryAnchor}</span>
          </div>
        )}
      </div>

      {/* Change Alert (Quiet Left Accent) */}
      {topic.changeAlert?.isChangeSensitive && (
        <div className="border-l-2 border-amber-500 pl-3.5 py-1 text-xs text-amber-950 dark:text-amber-200 space-y-0.5 select-none">
          <div className="font-mono font-bold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Change Alert</span>
          </div>
          <div>
            <FormattedText text={topic.changeAlert.currentFactSummary} />
          </div>
        </div>
      )}

      {/* 1. ORIENTATION & WHAT HAPPENED */}
      {orientationParagraphs.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase select-none">
            ORIENTATION & WHAT HAPPENED
          </div>
          <div className="space-y-2 text-sm sm:text-[15px] text-[var(--text-primary)] font-serif leading-relaxed">
            {orientationParagraphs.map((para, pIdx) => (
              <p key={pIdx}><FormattedText text={para} /></p>
            ))}
          </div>
        </div>
      )}

      {/* 2. WHY IT MATTERS (CONCEPTUAL CONTEXT & MECHANISM) */}
      {whyItMattersParagraphs.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-mono font-bold tracking-wider text-amber-900/90 dark:text-amber-400 uppercase select-none">
            WHY IT MATTERS / CONCEPTUAL CONTEXT
          </div>
          <div className="space-y-2 text-sm text-[var(--text-secondary)] font-serif leading-relaxed italic bg-amber-50/40 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200/40 dark:border-amber-800/30">
            {whyItMattersParagraphs.map((para, cIdx) => (
              <p key={cIdx}><FormattedText text={para} /></p>
            ))}
          </div>
        </div>
      )}

      {/* 3. KEY RULES & NUMBERS */}
      {distinctMemorizeFacts.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-mono font-bold tracking-wider text-amber-950 dark:text-amber-300 uppercase select-none">
            KEY RULES & NUMBERS
          </div>
          <StructuredFactBlock facts={distinctMemorizeFacts} />
        </div>
      )}

      {/* 4. EXAM RECALL & ANGLES */}
      {filteredExamFocus.length > 0 && (
        <div className="border-l-2 border-emerald-600/80 dark:border-emerald-500/80 pl-3.5 py-1 space-y-1.5 text-xs sm:text-sm font-sans">
          <div className="font-mono font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider text-[11px] select-none flex items-center gap-1.5">
            <span>🎯</span>
            <span>EXAM ANGLES & RECALL</span>
          </div>
          <ul className="space-y-1 text-emerald-950 dark:text-emerald-200">
            {filteredExamFocus.map((focus, efIdx) => (
              <li key={efIdx} className="flex items-start gap-2">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 select-none">•</span>
                <span className="leading-relaxed"><FormattedText text={focus} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source Provenance */}
      <details className="pt-1 text-xs font-mono text-[var(--text-subtle)] select-none">
        <summary className="cursor-pointer hover:text-[var(--text-primary)] transition-colors list-none flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-[var(--text-subtle)]" />
          <span>Source details ▾</span>
        </summary>
        <div className="mt-2 p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
            <span>Status: {topic.verificationStatus.replace(/_/g, " ")}</span>
            <span>·</span>
            <Calendar className="w-3 h-3 text-[var(--text-subtle)]" />
            <span>Event: {topic.initialEventDate}</span>
          </div>
          {topic.sourceReferences && topic.sourceReferences.length > 0 && (
            <div className="text-[var(--text-muted)]">
              Sources: {topic.sourceReferences.map(s => `${s.sourceName} (${s.batchName})`).join(", ")}
            </div>
          )}
        </div>
      </details>
    </article>
  );
}
