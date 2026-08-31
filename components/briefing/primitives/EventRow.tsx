"use client";

import React from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { formatCleanCategory } from "@/lib/banking-ca/formatters";
import {
  CheckCircle2,
  Circle,
  UserCheck,
  Trophy,
  Award,
  Calendar,
  Handshake
} from "lucide-react";

interface PrimitiveProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function EventRow({ topic, isRead, onToggleRead }: PrimitiveProps) {
  const isAppointment = topic.primaryCategory === 'APPOINTMENTS' || /\b(appoint|ceo|director|governor|chairman|cmd)\b/i.test(topic.title);
  const isAward = /\b(award|prize|jnanpith|medal|honour)\b/i.test(topic.title);
  const isSports = topic.primaryCategory === 'SPORTS_AND_AWARDS' || /\b(cup|championship|wimbledon|olympic|world cup)\b/i.test(topic.title);

  const EventIcon = isAppointment ? UserCheck : isAward ? Award : isSports ? Trophy : Handshake;

  return (
    <article
      id={topic.slug}
      className={`py-5 first:pt-2 space-y-2.5 transition-opacity ${
        isRead ? "opacity-75" : ""
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--text-subtle)] select-none">
        <div className="flex items-center gap-1.5">
          <EventIcon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
          <span className="uppercase tracking-wider font-semibold text-[11px] text-stone-800 dark:text-stone-300">
            {formatCleanCategory(topic.primaryCategory)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {topic.initialEventDate && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-subtle)]">
              <Calendar className="w-2.5 h-2.5" />
              <span>{topic.initialEventDate}</span>
            </span>
          )}
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

      {/* Title & Subtitle */}
      <div>
        <h4 className="font-serif font-bold text-base sm:text-lg text-[var(--text-primary)] leading-snug">
          {topic.title}
        </h4>
        {topic.subtitle && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 font-serif italic">
            {topic.subtitle}
          </p>
        )}
      </div>

      {/* Facts List with Quiet Left Accent */}
      {topic.mustMemorizeFacts && topic.mustMemorizeFacts.length > 0 && (
        <ul className="border-l-2 border-stone-300 dark:border-stone-700 pl-3.5 py-0.5 space-y-1 text-sm font-serif leading-relaxed text-[var(--text-primary)]">
          {topic.mustMemorizeFacts.map((fact, fIdx) => (
            <li key={fIdx} className="flex items-start gap-2">
              <span className="text-stone-400 dark:text-stone-500 font-bold select-none">•</span>
              <span className="leading-relaxed"><FormattedText text={fact} /></span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
