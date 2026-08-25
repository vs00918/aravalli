import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, AlertCircle, ArrowLeft, Landmark, Tag } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface TopicHeaderProps {
  topic: CanonicalTopic;
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  const isP1 = topic.priority.startsWith("P1");
  const isP2 = topic.priority === "P2_HIGH";

  const priorityColor = isP1
    ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
    : isP2
    ? "bg-amber-950/40 text-amber-400 border-amber-800/40"
    : "bg-slate-900 text-slate-400 border-slate-700/40";

  return (
    <header className="space-y-4 pb-6 border-b border-[var(--border-primary)]">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/topics"
          className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Canonical Directory</span>
        </Link>
        <span className="text-[11px] font-mono text-[var(--text-subtle)]">
          {topic.chronologicalMonth} ({topic.chronologicalWeek})
        </span>
      </div>

      {/* Priority & Meta Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className={`px-2.5 py-1 rounded font-bold border ${priorityColor}`}>
          {topic.priority.replace(/_/g, " ")}
        </span>

        <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--surface-elevated)] text-[var(--text-primary)] font-semibold border border-[var(--border-primary)]">
          <Landmark className="w-3.5 h-3.5 text-emerald-400" />
          <span>{topic.primaryInstitution}</span>
        </span>

        <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]">
          <Tag className="w-3 h-3 text-[var(--text-subtle)]" />
          <span>{topic.primaryCategory.replace(/_/g, " ")}</span>
        </span>

        {topic.regulatoryStatus !== "IMPLEMENTED" && (
          <span className="px-2 py-1 rounded bg-amber-950/40 text-amber-400 font-bold border border-amber-800/40">
            STATUS: {topic.regulatoryStatus}
          </span>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1 text-[var(--text-subtle)] font-semibold">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>~{topic.revisionMinutes} min</span>
          </span>
          <Link
            href={`/revision?topic=${topic.slug}`}
            className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors inline-flex items-center gap-1"
          >
            <span>Revise Topic</span>
          </Link>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] leading-tight">
          {topic.title}
        </h1>
        {topic.subtitle && (
          <p className="text-sm font-serif italic text-[var(--text-muted)] mt-1">
            {topic.subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
