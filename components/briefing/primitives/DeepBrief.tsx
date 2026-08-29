"use client";

import React from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import { 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Circle,
  FileText,
  ShieldCheck,
  Calendar,
  Sparkles
} from "lucide-react";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function DeepBrief({ topic, isRead, onToggleRead }: PrimitiveProps) {
  const isP1 = topic.priority.startsWith("P1");

  return (
    <article
      id={topic.slug}
      className={`py-8 first:pt-3 space-y-4.5 transition-opacity ${
        isRead ? "opacity-85" : ""
      }`}
    >
      {/* Top Metadata & Controls Bar */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-red-100/80 dark:bg-red-950/40 text-red-900 dark:text-red-300 border border-red-300/70 dark:border-red-800/40">
            <Sparkles className="w-3 h-3 text-red-700 dark:text-red-400" />
            <span>{isP1 ? "P1 CRITICAL" : "P2 DEEP"}</span>
          </span>
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
          <span className="inline-flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
            <span>~{topic.revisionMinutes} min</span>
          </span>

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
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] leading-tight tracking-tight">
          {topic.title}
        </h3>
        {topic.subtitle && (
          <p className="text-sm text-[var(--text-muted)] mt-1.5 font-serif italic">
            {topic.subtitle}
          </p>
        )}
      </div>

      {/* Change Alert */}
      {topic.changeAlert?.isChangeSensitive && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 select-none">
          <AlertTriangle className="w-4 h-4 text-amber-800 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <FormattedText text={topic.changeAlert.currentFactSummary} />
          </div>
        </div>
      )}

      {/* WHAT HAPPENED */}
      {topic.whatHappened && topic.whatHappened.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase select-none">
            WHAT HAPPENED
          </div>
          <div className="space-y-2 text-sm sm:text-[15px] text-[var(--text-primary)] font-serif leading-relaxed">
            {topic.whatHappened.map((para, pIdx) => (
              <p key={pIdx}><FormattedText text={para} /></p>
            ))}
          </div>
        </div>
      )}

      {/* MUST MEMORIZE / KEY NUMBERS & RULES */}
      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
        <div className="space-y-1.5 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/30">
          <div className="text-xs font-mono font-bold tracking-wider text-amber-950 dark:text-amber-300 uppercase select-none">
            MUST MEMORIZE / KEY RULES
          </div>
          <ul className="space-y-1.5 text-sm sm:text-[15px] font-serif leading-relaxed text-[var(--text-primary)] pl-1">
            {topic.mustMemorizeFacts.map((fact, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2.5">
                <span className="text-amber-800 dark:text-amber-400 font-bold mt-0.5 text-xs select-none">•</span>
                <span className="flex-1 leading-relaxed"><FormattedText text={fact} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KNOW / UNDERSTAND (PEDAGOGICAL CONTEXT) */}
      {topic.knowUnderstandContext && topic.knowUnderstandContext.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold tracking-wider text-[var(--text-subtle)] uppercase select-none">
            KNOW / UNDERSTAND (CONCEPTUAL CONTEXT)
          </div>
          <div className="space-y-1.5 text-sm text-[var(--text-muted)] font-serif leading-relaxed">
            {topic.knowUnderstandContext.map((para, cIdx) => (
              <p key={cIdx}><FormattedText text={para} /></p>
            ))}
          </div>
        </div>
      )}

      {/* EXAM FOCUS / EXAM ANGLES */}
      {topic.examFocus && topic.examFocus.length > 0 && (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300/70 dark:border-emerald-800/40 text-xs sm:text-sm font-sans space-y-1.5">
          <div className="font-mono font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider text-[11px] select-none flex items-center gap-1.5">
            <span>🎯</span>
            <span>EXAM ANGLES & MCQ APPLICATION</span>
          </div>
          <ul className="space-y-1 text-emerald-950 dark:text-emerald-200">
            {topic.examFocus.map((focus, efIdx) => (
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
