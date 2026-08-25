import React from "react";
import Link from "next/link";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-static";

export default function TopicsDirectoryPage() {
  const registry = getBankingCaRegistry();
  const topics = Object.values(registry.topics);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <BookOpen className="w-4 h-4" />
          <span>Canonical Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          All Canonical Topics ({topics.length})
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Deduplicated, single-event knowledge nodes compiled across all coaching batches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="group p-4 rounded-xl bg-[var(--surface-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] hover:border-emerald-800/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-muted)] font-semibold border border-[var(--border-primary)]">
                  {topic.primaryInstitution}
                </span>
                <span className={`px-1.5 py-0.5 rounded font-bold ${
                  topic.priority.startsWith('P1')
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                    : topic.priority === 'P2_HIGH'
                    ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-700/40'
                }`}>
                  {topic.priority.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="font-serif font-semibold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                {topic.title}
              </h2>
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--border-primary)] flex items-center justify-between text-[11px] font-mono text-[var(--text-subtle)]">
              <span>~{topic.revisionMinutes}m revision</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                Read Note <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
