"use client";

import React from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import { 
  CheckCircle2, 
  Circle
} from "lucide-react";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function FactStrip({ topic, isRead, onToggleRead }: PrimitiveProps) {
  return (
    <article
      id={topic.slug}
      className={`py-3.5 first:pt-1 space-y-1.5 transition-opacity ${
        isRead ? "opacity-70" : ""
      }`}
    >
      {/* Top micro metadata */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <span className="uppercase tracking-wider font-semibold text-[10px] text-[var(--text-muted)]">
          {formatCleanCategory(topic.primaryCategory)}
        </span>

        <div className="flex items-center gap-2">
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

      {/* Title */}
      <h3 className="font-serif font-bold text-[15px] text-[var(--text-primary)] leading-snug">
        {topic.title}
      </h3>

      {/* Bullets */}
      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
        <ul className="space-y-1 text-sm text-[var(--text-primary)] font-serif leading-relaxed pl-0.5">
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
