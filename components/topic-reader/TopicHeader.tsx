"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ArrowLeft, Landmark, Zap, CheckCircle2, Circle } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { formatTopicCategory, formatTopicDate } from "@/lib/banking-ca/formatters";
import { isTopicReadSlug, toggleTopicReadSlug } from "@/lib/banking-ca/reading-state";

interface TopicHeaderProps {
  topic: CanonicalTopic;
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  const [isRead, setIsRead] = useState<boolean>(false);
  const isP1 = topic.priority.startsWith("P1");
  const isP2 = topic.priority === "P2_HIGH";

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

  const priorityColor = isP1
    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/50"
    : isP2
    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]"
    : "bg-[var(--surface-elevated)] text-[var(--text-subtle)] border border-[var(--border-primary)]";

  const categoryDisplay = formatTopicCategory(topic.primaryInstitution, topic.primaryCategory);
  const dateDisplay = formatTopicDate(topic.initialEventDate, topic.chronologicalMonth, topic.chronologicalWeek);

  return (
    <header className="space-y-4 pb-6 border-b border-[var(--border-primary)] select-none">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/briefing/${topic.chronologicalMonth}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-900 dark:text-amber-400 hover:underline transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Current Affairs / {topic.chronologicalMonth} Stream</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleRead}
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
          >
            {isRead ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                <span>Read</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" />
                <span>Mark as Read</span>
              </>
            )}
          </button>
          <span className="text-[11px] font-mono text-[var(--text-subtle)]">
            {dateDisplay}
          </span>
        </div>
      </div>

      {/* Priority & Meta Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className={`px-2.5 py-1 rounded-md font-bold border ${priorityColor}`}>
          {topic.priority.replace(/_/g, " ")}
        </span>

        <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--surface-elevated)] text-[var(--text-primary)] font-semibold border border-[var(--border-primary)]">
          <Landmark className="w-3.5 h-3.5 text-amber-900 dark:text-amber-400" />
          <span>{categoryDisplay}</span>
        </span>

        {/* ONLY render regulatory status if explicitly defined */}
        {topic.regulatoryStatus && (
          <span className="px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40">
            STATUS: {topic.regulatoryStatus}
          </span>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1 text-[var(--text-subtle)] font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-900 dark:text-amber-400" />
            <span>~{topic.revisionMinutes} min</span>
          </span>
          <Link
            href={`/revision?topic=${topic.slug}`}
            className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-mono text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Drill Unit</span>
          </Link>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] leading-tight tracking-tight">
          {topic.title}
        </h1>
        {topic.subtitle && (
          <p className="text-sm font-serif italic text-[var(--text-muted)] mt-1.5 leading-relaxed">
            {topic.subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
