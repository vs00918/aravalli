import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Layers } from "lucide-react";
import { IngestionBatch } from "@/lib/banking-ca/schema";

interface CurrentMonthSnapshotProps {
  batches: IngestionBatch[];
  topicsCount: number;
}

export function CurrentMonthSnapshot({ batches }: CurrentMonthSnapshotProps) {
  return (
    <section className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-800/40">
            <Calendar className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-serif font-bold text-[var(--text-primary)]">
            Current Target Window: August 2026
          </h2>
        </div>
        <Link
          href="/chronology"
          className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>Chronology View</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)]">
          <div className="flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-[var(--text-subtle)]" />
            <span className="text-[var(--text-muted)] font-medium">Active Window Feed</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)] font-mono">
            {batches.length} Ingested Batches
          </span>
        </div>

        {/* Ingested Batch Timeline */}
        <div className="space-y-2 pt-1">
          {batches.map((b) => (
            <div
              key={b.batchId}
              className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-1 shadow-xs"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-bold text-[var(--text-primary)]">{b.sourceName}</span>
                <span className="text-[var(--text-muted)]">{b.dateRange}</span>
              </div>
              <p className="text-[11px] text-[var(--text-subtle)] leading-relaxed">
                {b.mentorVerdict}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
