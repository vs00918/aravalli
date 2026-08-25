import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface TopicNavigationProps {
  prevTopic: CanonicalTopic | null;
  nextTopic: CanonicalTopic | null;
}

export function TopicNavigation({ prevTopic, nextTopic }: TopicNavigationProps) {
  return (
    <nav aria-label="Topic Navigation" className="pt-6 border-t border-[var(--border-primary)] grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prevTopic ? (
        <Link
          href={`/topics/${prevTopic.slug}`}
          className="group p-4 rounded-xl bg-[var(--surface-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] hover:border-emerald-800/40 transition-colors flex flex-col justify-between space-y-1"
        >
          <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-subtle)] uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Previous Topic
          </span>
          <span className="font-serif font-semibold text-xs text-[var(--text-primary)] line-clamp-1">
            {prevTopic.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {nextTopic ? (
        <Link
          href={`/topics/${nextTopic.slug}`}
          className="group p-4 rounded-xl bg-[var(--surface-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] hover:border-emerald-800/40 transition-colors flex flex-col justify-between space-y-1 sm:text-right"
        >
          <span className="flex items-center justify-end gap-1 text-[10px] font-mono text-[var(--text-subtle)] uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
            Next Topic <ArrowRight className="w-3 h-3" />
          </span>
          <span className="font-serif font-semibold text-xs text-[var(--text-primary)] line-clamp-1">
            {nextTopic.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}
