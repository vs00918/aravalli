import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock, ShieldAlert } from "lucide-react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";

interface ChangeSensitiveCardProps {
  changeTopics: CanonicalTopic[];
}

export function ChangeSensitiveCard({ changeTopics }: ChangeSensitiveCardProps) {
  if (!changeTopics || changeTopics.length === 0) {
    return null;
  }

  return (
    <section id="alerts" className="p-5 rounded-2xl bg-amber-950/15 border border-amber-800/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-900/30 text-amber-400 border border-amber-700/40">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-serif font-bold text-amber-300">
            Change-Sensitive & Draft Tracking ({changeTopics.length})
          </h2>
        </div>
        <span className="text-[11px] font-mono text-amber-400/80">
          Recheck before Exam
        </span>
      </div>

      <div className="space-y-3">
        {changeTopics.map((topic) => (
          <div
            key={topic.id}
            className="p-3.5 rounded-xl bg-[var(--surface-primary)] border border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-1.5 py-0.2 rounded bg-amber-950/50 text-amber-400 font-bold border border-amber-800/40">
                  {topic.regulatoryStatus}
                </span>
                <span className="text-[var(--text-muted)]">{topic.primaryInstitution}</span>
              </div>
              <h3 className="font-serif font-semibold text-xs text-[var(--text-primary)]">
                {topic.title}
              </h3>
              {topic.changeAlert && (
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  ⚠️ {topic.changeAlert.currentFactSummary}
                </p>
              )}
            </div>

            <Link
              href={`/topics/${topic.slug}`}
              className="self-start sm:self-center flex-shrink-0 inline-flex items-center gap-1 text-xs font-mono font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
