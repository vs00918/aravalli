import React from "react";
import Link from "next/link";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { Landmark, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export const dynamic = "force-static";

export default function InstitutionsDirectoryPage() {
  const registry = getBankingCaRegistry();
  const instMap = registry.indexes.byInstitution;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <Landmark className="w-4 h-4" />
          <span>Regulatory &amp; Financial Entities</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Institutions Exploration
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Explore canonical current affairs classified dynamically by apex regulatory authority and multilateral body.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(instMap).map(([inst, topicIds]) => {
          const topics = topicIds.map(id => registry.topics[id]).filter(Boolean);
          const p1Count = topics.filter(t => t.priority.startsWith('P1')).length;
          const p2Count = topics.filter(t => t.priority === 'P2_HIGH').length;
          const p3Count = topics.filter(t => t.priority === 'P3_MODERATE').length;
          const totalMinutes = topics.reduce((acc, t) => acc + t.revisionMinutes, 0);

          return (
            <div
              key={inst}
              className="p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-base text-[var(--text-primary)]">
                    {inst.replace(/_/g, " ")}
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    ~{totalMinutes}m
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {p1Count > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-bold">
                      {p1Count} P1
                    </span>
                  )}
                  {p2Count > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
                      {p2Count} P2
                    </span>
                  )}
                  {p3Count > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700/40">
                      {p3Count} P3
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--text-muted)]">
                  {topicIds.length} canonical topics indexed.
                </p>
              </div>

              <Link
                href={`/search?institution=${inst}`}
                className="inline-flex items-center justify-between text-xs font-mono text-emerald-400 hover:text-emerald-300 pt-3 border-t border-[var(--border-primary)] transition-colors"
              >
                <span>Filter {inst.replace(/_/g, " ")} Topics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
