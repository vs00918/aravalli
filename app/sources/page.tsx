import React from "react";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-static";

export default function SourcesPage() {
  const registry = getBankingCaRegistry();
  const batches = registry.batches;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <FileText className="w-4 h-4" />
          <span>Batch Audit &amp; Accounting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Ingested Sources &amp; Audit Logs
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Complete mathematical reconciliation of evaluated raw stories, deduplications, and mentor verdicts.
        </p>
      </div>

      <div className="space-y-4">
        {batches.map((b) => (
          <div
            key={b.batchId}
            className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-primary)]">
              <div>
                <h2 className="font-serif font-bold text-base text-[var(--text-primary)]">
                  {b.sourceName}
                </h2>
                <div className="text-xs font-mono text-[var(--text-muted)]">
                  Range: {b.dateRange} · Ingested: {b.ingestedAt}
                </div>
              </div>
              <span className="self-start sm:self-center px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-400 text-xs font-mono font-bold border border-emerald-800/40">
                Audited &amp; Reconciled
              </span>
            </div>

            {/* Reconciliation Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)]">
                <span className="text-[var(--text-subtle)] block text-[10px]">Raw Evaluated</span>
                <span className="font-bold text-[var(--text-primary)]">{b.rawItemsCount}</span>
              </div>
              <div className="p-2.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)]">
                <span className="text-[var(--text-subtle)] block text-[10px]">Duplicates Removed</span>
                <span className="font-bold text-[var(--text-primary)]">{b.duplicatesCount}</span>
              </div>
              <div className="p-2.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)]">
                <span className="text-[var(--text-subtle)] block text-[10px]">Enrichments Merged</span>
                <span className="font-bold text-[var(--text-primary)]">{b.enrichmentsCount}</span>
              </div>
              <div className="p-2.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)]">
                <span className="text-[var(--text-subtle)] block text-[10px]">Low-Yield Filtered</span>
                <span className="font-bold text-[var(--text-primary)]">{b.ignoredCount}</span>
              </div>
            </div>

            {/* Mentor Verdict */}
            <div className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Mentor Verdict
              </span>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {b.mentorVerdict}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
