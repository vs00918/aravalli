import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Clock } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface RecentlyUpdatedFeedProps {
  topics: CanonicalTopic[];
}

export function RecentlyUpdatedFeed({ topics }: RecentlyUpdatedFeedProps) {
  // Show 6 recent topics
  const recentTopics = topics.slice(0, 6);

  return (
    <section className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-400 border border-purple-300 dark:border-purple-800/40">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-serif font-bold text-[var(--text-primary)]">
            Recently Ingested &amp; High-Yield Feed
          </h2>
        </div>
        <Link
          href="/topics"
          className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>All {topics.length} Topics</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-[var(--border-primary)]">
        {recentTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="group py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 block hover:opacity-90 transition-opacity"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] font-semibold border border-[var(--border-primary)]">
                  {topic.primaryInstitution}
                </span>
                <span className="text-[var(--text-subtle)] font-medium">
                  {topic.primaryCategory.replace(/_/g, " ")}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-serif font-medium text-[var(--text-primary)] group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors truncate">
                {topic.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 text-[11px] font-mono text-[var(--text-muted)] font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{topic.revisionMinutes}m
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
