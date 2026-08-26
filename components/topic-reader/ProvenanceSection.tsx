import React from "react";
import { ChevronDown, ShieldCheck, FileText, Calendar, Tag } from "lucide-react";
import { SourceReference, VerificationStatus } from "@/lib/banking-ca/schema";

interface ProvenanceSectionProps {
  sources: SourceReference[];
  verificationStatus: VerificationStatus;
  initialEventDate: string;
  lastUpdatedDate: string;
  category?: string;
  institution?: string;
  rawMarkdown?: string;
}

export function ProvenanceSection({
  sources,
  verificationStatus,
  initialEventDate,
  lastUpdatedDate,
  category,
  institution,
  rawMarkdown
}: ProvenanceSectionProps) {
  return (
    <details className="mt-8 pt-4 border-t border-[var(--border-primary)] group select-none text-xs font-mono text-[var(--text-subtle)]">
      <summary className="flex items-center justify-between cursor-pointer py-2 hover:text-[var(--text-primary)] transition-colors list-none">
        <span className="flex items-center gap-2 font-medium">
          <FileText className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
          <span>More details &amp; source verification</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-3 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] space-y-3">
        {/* Verification Status & Dates */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <span className="font-semibold text-[var(--text-muted)]">Verification:</span>
            <span>{verificationStatus.replace(/_/g, " ")}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <Calendar className="w-3 h-3 text-[var(--text-subtle)]" />
            <span>Event: {initialEventDate}</span>
            <span>·</span>
            <span>Updated: {lastUpdatedDate}</span>
          </div>
        </div>

        {/* Source References */}
        {sources && sources.length > 0 && (
          <div className="space-y-1 text-[11px]">
            <span className="font-semibold text-[var(--text-muted)]">Source References: </span>
            <div className="text-[var(--text-muted)] pl-2">
              {sources.map((s, idx) => (
                <div key={idx}>• {s.sourceName} ({s.batchName})</div>
              ))}
            </div>
          </div>
        )}

        {/* Category & Institution */}
        {(category || institution) && (
          <div className="flex items-center gap-2 text-[11px] pt-1">
            <Tag className="w-3 h-3 text-[var(--text-subtle)]" />
            <span>Category: {category?.replace(/_/g, " ")} {institution && institution !== "OTHER" ? `· ${institution}` : ""}</span>
          </div>
        )}

        {/* Raw Markdown */}
        {rawMarkdown && (
          <div className="pt-2 border-t border-[var(--border-primary)]">
            <span className="font-semibold text-[var(--text-muted)] block mb-1">Raw Canonical Markdown:</span>
            <pre className="p-3 rounded bg-[var(--bg-primary)] border border-[var(--border-primary)] whitespace-pre-wrap font-mono text-[10px] text-[var(--text-muted)] leading-relaxed max-h-48 overflow-y-auto">
              {rawMarkdown}
            </pre>
          </div>
        )}
      </div>
    </details>
  );
}
