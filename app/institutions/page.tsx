import React from "react";
import Link from "next/link";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { Landmark, ArrowRight } from "lucide-react";

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
          Institutions Index
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Explore canonical current affairs classified by apex regulatory authority.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(instMap).map(([inst, topicIds]) => (
          <div
            key={inst}
            className="p-4 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="font-serif font-bold text-sm text-[var(--text-primary)]">
                {inst.replace(/_/g, " ")}
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] mt-1">
                {topicIds.length} Canonical Events
              </div>
            </div>
            <Link
              href={`/topics?institution=${inst}`}
              className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 pt-2 border-t border-[var(--border-primary)]"
            >
              <span>View Topics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
