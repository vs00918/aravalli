"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock, Zap } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import { isTopicReadSlug, toggleTopicReadSlug } from "@/lib/banking-ca/reading-state";

interface TopicHeaderProps {
  topic: CanonicalTopic;
}

const MONTH_NAMES: Record<string, string> = {
  "2026-01": "January 2026",
  "2026-02": "February 2026",
  "2026-03": "March 2026",
  "2026-04": "April 2026",
  "2026-05": "May 2026",
  "2026-06": "June 2026",
  "2026-07": "July 2026",
  "2026-08": "August 2026",
  "2026-09": "September 2026",
  "2026-10": "October 2026",
  "2026-11": "November 2026",
  "2026-12": "December 2026",
};

export function TopicHeader({ topic }: TopicHeaderProps) {
  const [isRead, setIsRead] = useState<boolean>(false);

  // Track last visited topic & read state in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("banking_ca_last_slug", topic.slug);
      localStorage.setItem("banking_ca_last_title", topic.title);
      setIsRead(isTopicReadSlug(topic.slug));
    } catch {
      // Ignore in SSR
    }
  }, [topic.slug, topic.title]);

  const handleToggleRead = () => {
    const next = toggleTopicReadSlug(topic.slug);
    setIsRead(next);
  };

  const monthLabel = MONTH_NAMES[topic.chronologicalMonth] || topic.chronologicalMonth;
  const categoryLabel = formatCleanCategory(topic.primaryCategory);

  return (
    <header className="space-y-3 pb-5 border-b border-[var(--border-primary)] select-none">
      {/* 1. Quiet Top Navigation & Secondary Controls */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono">
        <Link
          href={`/briefing/${topic.chronologicalMonth}`}
          className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>← {monthLabel}</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-subtle)] font-medium">
            <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
            <span>~{topic.revisionMinutes} min</span>
          </span>

          <button
            onClick={handleToggleRead}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-2 py-0.5 rounded hover:bg-[var(--surface-elevated)]"
            title={isRead ? "Mark as unread" : "Mark as read"}
          >
            {isRead ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                <span className="font-medium text-emerald-900 dark:text-emerald-300">Read</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                <span>Mark as read</span>
              </>
            )}
          </button>

          <Link
            href={`/revision?topic=${topic.slug}`}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-amber-900 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/40 hover:bg-amber-200/80 transition-colors"
            title="Practice Active Recall Drill"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Drill</span>
          </Link>
        </div>
      </div>

      {/* 2. Contextual Tag (At most ONE quiet indicator) */}
      <div className="pt-1">
        <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[var(--text-subtle)] font-semibold">
          {categoryLabel}
        </span>
      </div>

      {/* 3. Title (Strongest visual element on screen) */}
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] leading-tight tracking-tight">
        {topic.title}
      </h1>

      {/* 4. Optional One-Line Subtitle / Key Number */}
      {topic.subtitle && (
        <p className="text-sm sm:text-base font-serif text-[var(--text-muted)] leading-relaxed italic">
          {topic.subtitle}
        </p>
      )}
    </header>
  );
}
