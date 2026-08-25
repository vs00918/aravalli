import React from "react";
import Link from "next/link";
import { Inbox, CheckCircle2, XCircle, Clock, ShieldAlert, Sparkles, FileText, ArrowRight } from "lucide-react";
import { getAllIngestionItems } from "@/lib/db/inbox";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const items = await getAllIngestionItems();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "INBOX":
        return { label: "Staging Inbox", badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20" };
      case "PROCESSING":
        return { label: "AI Processing", badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20" };
      case "REVIEW":
        return { label: "Awaiting Human Review", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" };
      case "ACCEPTED":
        return { label: "Committed to Encyclopedia", badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" };
      case "REJECTED":
        return { label: "Rejected / Discarded", badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20" };
      default:
        return { label: status, badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20" };
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
          <Inbox className="w-4 h-4" />
          <span>Ingestion & Research Staging</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 dark:text-slate-100">
          Human-in-the-Loop Review Buffer
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
          AI extractions and uncommitted research items must never automatically pollute the permanent encyclopedia. This staging area provides the strict review boundary where extractions are verified before joining the knowledge tree.
        </p>
      </div>

      {/* Principle Banner */}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-[#0d1520] flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans">
          <strong className="font-semibold text-slate-900 dark:text-slate-100">Integrity Rule:</strong> Every proposed concept, connection, or claim remains in staging until audited against first principles and confirmed by the curator.
        </p>
      </div>

      {/* Ingestion Items Grid */}
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            Inbox is clear. No uncommitted research items in staging.
          </div>
        ) : (
          items.map((item) => {
            const st = getStatusStyle(item.status);
            return (
              <article
                key={item.id}
                className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-4 hover:border-emerald-500/30 transition-all shadow-sm"
              >
                {/* Header: Title and Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-serif font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h2>
                    {item.source && (
                      <p className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Source: {item.source.title}</span>
                      </p>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border font-semibold shrink-0 ${st.badge}`}>
                    {st.label}
                  </span>
                </div>

                {/* Extracted Summary */}
                {item.extractedSummary && (
                  <div className="space-y-1 bg-slate-50 dark:bg-[#151e2d]/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Extracted Candidate Summary:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed pt-1">
                      {item.extractedSummary}
                    </p>
                  </div>
                )}

                {/* Candidate Concepts & Connections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  {item.candidateConcepts && (
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Proposed Concepts:
                      </span>
                      <p className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
                        {item.candidateConcepts}
                      </p>
                    </div>
                  )}

                  {item.candidateConnections && (
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Proposed Bridges:
                      </span>
                      <p className="font-mono text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
                        {item.candidateConnections}
                      </p>
                    </div>
                  )}
                </div>

                {/* Human Review Action Controls */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Staging ID: {item.id.slice(0, 10)}...
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Commit to Tree</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
