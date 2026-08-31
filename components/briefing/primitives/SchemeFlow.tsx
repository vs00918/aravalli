"use client";

import React from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { CheckCircle2, Circle, Layers, Compass } from "lucide-react";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function SchemeFlow({ topic, isRead, onToggleRead }: PrimitiveProps) {
  const facts = topic.mustMemorizeFacts || topic.whatHappened || [];

  return (
    <article
      id={topic.slug}
      className={`py-5 space-y-3 transition-opacity ${isRead ? "opacity-80" : ""}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
          <span className="font-semibold text-[11px] uppercase tracking-wider text-teal-950 dark:text-teal-300">
            SCHEME ARCHITECTURE
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
          >
            Focus ↗
          </Link>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-base sm:text-lg font-serif font-bold text-[var(--text-primary)] tracking-tight leading-snug">
        {topic.title}
      </h4>

      {/* Facts in Quiet List */}
      <div className="border-l-2 border-teal-500/70 dark:border-teal-400/60 pl-3.5 py-1 space-y-2 text-sm text-[var(--text-primary)] font-serif leading-relaxed">
        {facts.map((fact, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-teal-700 dark:text-teal-400 font-bold mt-1 text-xs select-none">•</span>
            <div className="flex-1 leading-relaxed">
              <FormattedText text={fact} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
