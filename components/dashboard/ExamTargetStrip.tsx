import React from "react";
import { Target, Calendar, CheckCircle2, Shield } from "lucide-react";
import { ExamTargetProfile } from "@/lib/banking-ca/schema";

interface ExamTargetStripProps {
  profiles: ExamTargetProfile[];
}

export function ExamTargetStrip({ profiles }: ExamTargetStripProps) {
  const defaultProfile = profiles.find(p => p.isDefault) || profiles[0];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-800/15 border border-amber-800/30 flex items-center justify-center text-amber-900 dark:text-amber-300 flex-shrink-0 shadow-2xs">
          <Target className="w-5 h-5 text-amber-900 dark:text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-[var(--text-primary)]">
              EXAM TARGET 2026
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800/40">
              Active Focus
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
            SBI PO Mains (Sep 2026) · IBPS PO Mains (Oct 2026)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <div className="px-3 py-1.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] flex items-center gap-1.5 text-[var(--text-muted)]">
          <Calendar className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
          <span>Active Window: <strong>April 2026 → Oct 2026</strong></span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/40 flex items-center gap-1.5 font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>Zero-LLM Fact Grounding</span>
        </div>
      </div>
    </div>
  );
}
