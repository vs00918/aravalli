"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Play, Clock, Sparkles } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface ContinueStudyingCardProps {
  defaultTopic: CanonicalTopic;
}

export function ContinueStudyingCard({ defaultTopic }: ContinueStudyingCardProps) {
  const [lastSlug, setLastSlug] = useState<string>("");
  const [lastTitle, setLastTitle] = useState<string>("");

  useEffect(() => {
    try {
      const savedSlug = localStorage.getItem("banking_ca_last_slug");
      const savedTitle = localStorage.getItem("banking_ca_last_title");
      if (savedSlug && savedTitle) {
        setLastSlug(savedSlug);
        setLastTitle(savedTitle);
      }
    } catch {
      // Ignore in SSR
    }
  }, []);

  const title = lastTitle || defaultTopic.title;
  const slug = lastSlug || defaultTopic.slug;
  const isResuming = Boolean(lastSlug);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-sm space-y-3 flex flex-col justify-between select-none">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Continue Studying</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]">
            {isResuming ? "Resume Active Reading" : "Suggested Start Point"}
          </span>
        </div>

        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--text-primary)] leading-snug">
            {title}
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
            {defaultTopic.primaryInstitution} · {defaultTopic.priority.replace(/_/g, " ")} · ~{defaultTopic.revisionMinutes} min
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border-primary)] flex items-center justify-between">
        <Link
          href={`/topics/${slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-mono text-xs font-bold transition-all shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isResuming ? "Continue Reading" : "Start First Topic"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/briefing/2026-08"
          className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline"
        >
          Open Briefing Stream →
        </Link>
      </div>
    </div>
  );
}
