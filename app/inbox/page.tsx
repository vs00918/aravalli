import React from "react";
import Link from "next/link";
import { Inbox, PlusCircle, Sparkles, FileText, ArrowRight, ShieldAlert } from "lucide-react";
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
        return { label: "Committed to Tree", badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" };
      case "REJECTED":
        return { label: "Rejected", badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20" };
      default:
        return { label: status, badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20" };
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
            <Inbox className="w-4 h-4" />
            <span>Ingestion & Research Staging</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 dark:text-slate-100">
            Human-in-the-Loop Review Buffer
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed max-w-xl">
            AI extractions and captured research items remain in this staging buffer until verified by you before joining the permanent knowledge tree.
          </p>
        </div>

        <Link
          href="/add"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold transition-all inline-flex items-center gap-2 shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add to Aravalli</span>
        </Link>
      </div>

      {/* Principle Banner */}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-[#0d1520] flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans">
          <strong className="font-semibold text-slate-900 dark:text-slate-100">Integrity Invariant:</strong> Proposed concepts, connections, and claims are never automatically added to permanent encyclopedia chapters without human review.
        </p>
      </div>

      {/* Ingestion Items Grid */}
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-serif text-slate-600 dark:text-slate-400">
              Inbox is clear. No uncommitted research items in staging.
            </p>
            <Link
              href="/add"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Capture a new source or note</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          items.map((item) => {
            const st = getStatusStyle(item.status);
            return (
              <Link
                key={item.id}
                href={`/inbox/${item.id}`}
                className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-4 hover:border-emerald-500/40 hover:shadow-md transition-all block group"
              >
                {/* Header: Title and Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-serif font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
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
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed line-clamp-2">
                    {item.extractedSummary}
                  </p>
                )}

                {/* Footer Action Guide */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <span>Open research review desk</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
