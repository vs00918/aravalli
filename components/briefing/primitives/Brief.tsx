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
  Calendar
} from "lucide-react";
import { StructuredFactBlock } from "./StructuredFactBlock";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function Brief({ topic, isRead, onToggleRead }: PrimitiveProps) {
  // Deduplicate examFocus against mustMemorizeFacts
  const filteredExamFocus = useMemo(() => {
    if (!topic.examFocus || topic.examFocus.length === 0) return [];
    const memoFacts = (topic.mustMemorizeFacts || []).map(f => f.toLowerCase().replace(/[^a-z0-9]/g, ''));

    return topic.examFocus.filter(focus => {
      const cleanFocus = focus.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (/\b(trap|note|watch out|caution|key distinction|eligible|ineligible|tenure|limit)\b/i.test(focus)) {
        return true;
      }
      const isDuplicated = memoFacts.some(f => f.includes(cleanFocus) || (cleanFocus.length > 20 && f.length > 20 && (cleanFocus.includes(f) || f.includes(cleanFocus))));
      return !isDuplicated;
    });
  }, [topic.examFocus, topic.mustMemorizeFacts]);

  const hasWhatHappened = topic.whatHappened && topic.whatHappened.length > 0;

  return (
    <article
      id={topic.slug}
      className={`py-6 first:pt-2 space-y-3 transition-opacity ${
        isRead ? "opacity-80" : ""
      }`}
    >
      {/* Header controls line */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <div className="flex items-center gap-2">
          {topic.regulatoryStatus && topic.regulatoryStatus !== 'NOTIFIED' && topic.regulatoryStatus !== 'IMPLEMENTED' && topic.regulatoryStatus !== 'APPROVED' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider bg-blue-100/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border border-blue-300/60 dark:border-blue-800/40">
              {topic.regulatoryStatus}
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
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
            )}
          </button>

          <Link
            href={`/revision?topic=${topic.slug}`}
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-900 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/60 hover:bg-amber-200/80 transition-colors"
            title="Practice Active Recall Drill"
          >
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>Drill</span>
          </Link>

          <Link
            href={`/topics/${topic.slug}`}
            className="text-[10px] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
            title="Open single topic focus reader"
          >
            Focus ↗
          </Link>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] leading-snug tracking-tight">
          {topic.title}
        </h3>
        {topic.subtitle && (
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-serif italic">
            {topic.subtitle}
          </p>
        )}
      </div>

      {/* Change Alert (Quiet Left Accent) */}
      {topic.changeAlert?.isChangeSensitive && (
        <div className="border-l-2 border-amber-500 pl-3 py-1 text-xs text-amber-950 dark:text-amber-200 select-none">
          <div className="font-mono font-bold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Change Alert</span>
          </div>
          <FormattedText text={topic.changeAlert.currentFactSummary} />
        </div>
      )}

      {/* Context / What Happened (if present) */}
      {hasWhatHappened && (
        <div className="space-y-1.5 text-sm sm:text-[15px] text-[var(--text-primary)] font-serif leading-relaxed">
          {topic.whatHappened.map((para, pIdx) => (
            <p key={pIdx}><FormattedText text={para} /></p>
          ))}
        </div>
      )}

      {/* KEY FACTS (Concise 3-5 bullets / metrics) */}
      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
        <div className="pt-0.5">
          <StructuredFactBlock facts={topic.mustMemorizeFacts} />
        </div>
      )}

      {/* EXAM POINT (Quiet Left Accent - Deduplicated) */}
      {filteredExamFocus.length > 0 && (
        <div className="border-l-2 border-amber-500/80 dark:border-amber-400/80 pl-3.5 py-1 space-y-1 text-xs sm:text-sm font-sans">
          <div className="font-mono font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider text-[10px] select-none">
            EXAM POINT
          </div>
          <ul className="space-y-1 text-amber-950 dark:text-amber-200">
            {filteredExamFocus.map((focus, efIdx) => (
              <li key={efIdx} className="flex items-start gap-2">
                <span className="font-bold text-amber-800 dark:text-amber-400 select-none">•</span>
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
