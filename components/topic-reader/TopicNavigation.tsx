import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface TopicNavigationProps {
  prevTopic: CanonicalTopic | null;
  nextTopic: CanonicalTopic | null;
  currentMonth: string;
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

export function TopicNavigation({ prevTopic, nextTopic, currentMonth }: TopicNavigationProps) {
  const monthLabel = MONTH_NAMES[currentMonth] || currentMonth;

  return (
    <div className="pt-8 mt-8 border-t border-[var(--border-primary)] space-y-4 select-none">
      {/* Previous / Next Inline Navigation */}
      <nav aria-label="Topic Navigation" className="flex items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/topics/${prevTopic.slug}`}
            className="group flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors max-w-[45%]"
          >
            <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <div className="truncate">
              <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Previous</span>
              <span className="font-serif truncate block">{prevTopic.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <Link
            href={`/topics/${nextTopic.slug}`}
            className="group flex items-center justify-end gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-right max-w-[45%] ml-auto"
          >
            <div className="truncate">
              <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Next</span>
              <span className="font-serif truncate block">{nextTopic.title}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </nav>

      {/* Subtle Return Link */}
      <div className="text-center pt-2">
        <Link
          href={`/briefing/${currentMonth}`}
          className="text-xs font-mono text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-2"
        >
          ← Back to {monthLabel} Stream
        </Link>
      </div>
    </div>
  );
}
