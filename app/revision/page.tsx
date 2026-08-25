import React from "react";
import Link from "next/link";
import { getP1Topics, getBankingCaRegistry } from "@/lib/banking-ca/data";
import { RotateCw, Clock, ArrowRight, Flame } from "lucide-react";

export const dynamic = "force-static";

export default function RevisionHubPage() {
  const p1Topics = getP1Topics();
  const registry = getBankingCaRegistry();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <RotateCw className="w-4 h-4" />
          <span>Active Retrieval &amp; Flashcards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Revision Hub (Phase W5 Foundation)
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Targeted recall sessions prioritizing the {p1Topics.length} Master P1 topics ({registry.summary.activeP1RevisionMinutes} min total).
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Active P1 Revision Deck ({p1Topics.length} Topics)</span>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold">
            {registry.summary.activeP1RevisionMinutes} min
          </span>
        </div>

        <div className="divide-y divide-[var(--border-primary)]">
          {p1Topics.map((topic, i) => (
            <div key={topic.id} className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                  #{i + 1} · {topic.primaryInstitution}
                </span>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="font-serif text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:text-emerald-400 transition-colors block"
                >
                  {topic.title}
                </Link>
              </div>
              <span className="flex-shrink-0 text-xs font-mono text-[var(--text-muted)]">
                ~{topic.revisionMinutes}m
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
