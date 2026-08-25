"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Compass,
  BookOpen,
  GitBranch,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  RotateCw,
} from "lucide-react";
import { IngestionItem } from "@/lib/types";

interface InboxReviewDeskProps {
  item: IngestionItem;
}

export function InboxReviewDesk({ item: initialItem }: InboxReviewDeskProps) {
  const [item, setItem] = useState<IngestionItem>(initialItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string>("");
  const router = useRouter();

  // Parse candidate concepts & connections
  let candidateConceptsList: string[] = [];
  if (item.candidateConcepts) {
    try {
      candidateConceptsList = JSON.parse(item.candidateConcepts);
    } catch {
      candidateConceptsList = [item.candidateConcepts];
    }
  }

  let candidateConnectionsList: Array<{
    sourceConceptSlug: string;
    targetConceptSlug: string;
    relationshipType: string;
    explanation: string;
  }> = [];
  if (item.candidateConnections) {
    try {
      candidateConnectionsList = JSON.parse(item.candidateConnections);
    } catch {
      // safe fallback
    }
  }

  // Handle Process Item
  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/inbox/${item.id}/process`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process item");
      setItem(data.item);
      setSuccessMsg("Knowledge proposal generated successfully.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Promote / Accept
  const handlePromote = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/inbox/${item.id}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetConceptSlug: selectedConcept || (candidateConceptsList[0] ?? "entropy"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to promote item");
      setItem(data.item);
      setSuccessMsg("Proposal promoted and committed to permanent knowledge tree!");
      setTimeout(() => router.refresh(), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "INBOX":
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
      case "REVIEW":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
      case "ACCEPTED":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
          <Link href="/inbox" className="hover:underline flex items-center gap-1">
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox</span>
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200">Review Desk</span>
        </div>

        <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border font-semibold ${getStatusBadge(item.status)}`}>
          {item.status}
        </span>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
          {successMsg}
        </div>
      )}

      {/* Item Title & Source Information */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900 dark:text-slate-100">
          {item.title}
        </h1>

        {item.source && (
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 pt-1">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Type: {item.source.type}
            </span>
            {item.source.author && <span>Author: {item.source.author}</span>}
            {item.source.url && (
              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline truncate max-w-xs"
              >
                {item.source.url}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Raw Captured Text */}
      {item.rawContent && (
        <div className="space-y-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Raw Captured Content:</span>
          </span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
            {item.rawContent}
          </p>
        </div>
      )}

      {/* Processing Trigger If INBOX Status */}
      {item.status === "INBOX" && (
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-[#0d1520] space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100">
              Generate Knowledge Proposal
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans max-w-md mx-auto">
              Run the local extraction processor to identify matching master chapters, candidate concepts, and cross-domain connections.
            </p>
          </div>

          <button
            onClick={handleProcess}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-mono font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Processing..." : "Process Item"}</span>
          </button>
        </div>
      )}

      {/* Structured Proposal Review Area (REVIEW or ACCEPTED status) */}
      {item.extractedSummary && (
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Extracted Knowledge Proposal</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              Local demonstration processing
            </span>
          </div>

          {/* Extracted Summary */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              What Was Found:
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
              {item.extractedSummary}
            </p>
          </div>

          {/* Matched Concepts */}
          {candidateConceptsList.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Target Concepts to Enrich in Encyclopedia:</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {candidateConceptsList.map((slug, idx) => (
                  <Link
                    key={idx}
                    href={`/concepts/${slug}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-serif font-semibold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>{slug.replace(/-/g, " ")}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Proposed Connections */}
          {candidateConnectionsList.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Proposed Cross-Domain Connections:</span>
              </span>

              <div className="space-y-2">
                {candidateConnectionsList.map((conn, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#151e2d]/60 border border-slate-200/70 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono font-semibold text-slate-800 dark:text-slate-200">
                      <span>{conn.sourceConceptSlug} ↔ {conn.targetConceptSlug}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                        {conn.relationshipType}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-sans">
                      {conn.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Controls (If in REVIEW status) */}
          {item.status === "REVIEW" && (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c121c] space-y-4">
              <div className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-400">
                <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Confirming this proposal will link this source to the selected concept and register the cross-domain bridges in the knowledge lattice.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => router.push("/inbox")}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePromote}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? "Promoting..." : "Accept & Commit to Encyclopedia"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
