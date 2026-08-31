"use client";

import React from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import { extractLeadMetric } from "@/lib/banking-ca/presentation-classifier";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function MetricCallout({ topic, isRead, onToggleRead }: PrimitiveProps) {
  const leadMetric = extractLeadMetric(topic);

  return (
    <article
      id={topic.slug}
      className={`py-5 first:pt-2 space-y-3 transition-opacity ${
        isRead ? "opacity-80" : ""
      }`}
    >
      {/* Top Control Bar */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span className="uppercase tracking-wider font-semibold text-[11px] text-amber-950 dark:text-amber-300">
            KEY METRIC · {formatCleanCategory(topic.primaryCategory)}
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
            href={`/topics/${topic.slug}`}
            className="text-[10px] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
            title="Open single topic focus reader"
          >
            Focus ↗
          </Link>
        </div>
      </div>

      {/* Lead Metric + Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
        {leadMetric && (
          <div className="font-mono font-bold text-2xl sm:text-3xl text-amber-900 dark:text-amber-300 tracking-tight select-none shrink-0">
            {leadMetric.value}
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-base sm:text-lg font-serif font-bold text-[var(--text-primary)] tracking-tight leading-snug">
            {topic.title}
          </h4>
          {topic.subtitle && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-serif italic">
              {topic.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Change Alert */}
      {topic.changeAlert?.isChangeSensitive && (
        <div className="border-l-2 border-amber-500 pl-3 py-1 text-xs text-amber-950 dark:text-amber-200 select-none">
          <div className="font-mono font-bold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-400 flex items-center gap-1 mb-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Change Alert</span>
          </div>
          <FormattedText text={topic.changeAlert.currentFactSummary} />
        </div>
      )}

      {/* Must Memorize Facts */}
      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
        <ul className="space-y-1.5 text-sm font-serif leading-relaxed text-[var(--text-primary)] pl-1">
          {topic.mustMemorizeFacts.map((fact, fIdx) => (
            <li key={fIdx} className="flex items-start gap-2">
              <span className="text-amber-800 dark:text-amber-400 font-bold select-none">•</span>
              <span className="leading-relaxed"><FormattedText text={fact} /></span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
