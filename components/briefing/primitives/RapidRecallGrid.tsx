"use client";

import React from "react";
import Link from "next/link";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { FormattedText } from "@/components/common/FormattedText";
import { CheckCircle2, Circle, Zap, ExternalLink } from "lucide-react";

interface RapidRecallGridProps {
  topics: CanonicalTopic[];
  readSlugs: Set<string>;
  onToggleRead: (slug: string) => void;
}

export function RapidRecallGrid({ topics, readSlugs, onToggleRead }: RapidRecallGridProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="my-6 rounded-xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 p-4 sm:p-5 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/50 dark:border-amber-900/30 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-amber-700 dark:text-amber-400 font-mono font-bold text-xs select-none">
            ⚡
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-300 tracking-tight uppercase">
              RAPID RECALL CAPSULE ({topics.length} Factoids)
            </h4>
            <p className="text-[11px] text-[var(--text-subtle)]">
              High-yield 1-minute facts, one-liners, and quick exam anchors
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-amber-900 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40 px-2 py-0.5 rounded">
          ~{topics.length} min scan
        </span>
      </div>

      {/* Grid of Compact Fact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {topics.map((topic) => {
          const isRead = readSlugs.has(topic.slug);
          const facts = topic.mustMemorizeFacts || topic.whatHappened || [topic.title];

          return (
            <div
              key={topic.slug}
              id={topic.slug}
              className={`p-3 rounded-xl border bg-white/90 dark:bg-gray-900/80 transition-all flex flex-col justify-between gap-2 ${
                isRead
                  ? "border-gray-200 dark:border-gray-800 opacity-60 bg-gray-50 dark:bg-gray-950"
                  : "border-amber-100/80 dark:border-amber-900/30 hover:border-amber-300 hover:shadow-xs"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {topic.informationType && topic.informationType !== 'OTHER' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold tracking-wider bg-amber-200/60 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-300/50">
                        {topic.informationType.replace(/_/g, ' ')}
                      </span>
                    )}
                    <span className="font-semibold text-xs text-[var(--text-primary)] line-clamp-2">
                      {topic.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleRead(topic.slug)}
                    className="shrink-0 p-0.5 hover:text-emerald-700 transition-colors"
                    title={isRead ? "Mark unread" : "Mark read"}
                  >
                    {isRead ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Atomic Recall Flashcard Strip */}
                {topic.atomicRecall && (
                  <div className="p-1.5 rounded-md bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-[11px] font-mono font-semibold text-amber-900 dark:text-amber-300">
                    <FormattedText text={topic.atomicRecall} />
                  </div>
                )}

                <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  <FormattedText text={facts[0] || topic.title} />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-subtle)] pt-1 border-t border-gray-100 dark:border-gray-800/60">
                <span className="truncate max-w-[150px]">{topic.primaryCategory}</span>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="inline-flex items-center gap-0.5 text-amber-900 dark:text-amber-400 hover:underline"
                >
                  Detail <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
