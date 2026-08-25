import React from "react";
import { ShieldCheck, FileText, Calendar } from "lucide-react";
import { SourceReference, VerificationStatus } from "@/lib/banking-ca/schema";

interface ProvenanceSectionProps {
  sources: SourceReference[];
  verificationStatus: VerificationStatus;
  initialEventDate: string;
  lastUpdatedDate: string;
}

export function ProvenanceSection({
  sources,
  verificationStatus,
  initialEventDate,
  lastUpdatedDate
}: ProvenanceSectionProps) {
  return (
    <footer className="pt-6 border-t border-[var(--border-primary)] space-y-3 text-xs font-mono text-[var(--text-subtle)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-[var(--text-muted)]">Verification Status:</span>
          <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)]">
            {verificationStatus.replace(/_/g, " ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Event: {initialEventDate}</span>
          <span>·</span>
          <span>Last Updated: {lastUpdatedDate}</span>
        </div>
      </div>

      {sources && sources.length > 0 && (
        <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] flex items-start gap-2 text-[11px]">
          <FileText className="w-4 h-4 text-[var(--text-subtle)] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--text-muted)]">Source Ingestion References: </span>
            <span>
              {sources.map(s => `${s.sourceName} (${s.batchName})`).join(", ")}
            </span>
          </div>
        </div>
      )}
    </footer>
  );
}
