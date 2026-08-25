import React from "react";
import Link from "next/link";
import { GitBranch, ArrowRightLeft, Sparkles, BookOpen } from "lucide-react";
import { getAllConnections } from "@/lib/db/connections";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const connections = await getAllConnections();

  const formatRelType = (type: string) => {
    switch (type) {
      case "STRUCTURAL_ANALOGY":
        return { label: "Structural Analogy (Isomorphism)", style: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" };
      case "DIRECT_PHYSICAL_CONNECTION":
        return { label: "Direct Physical Connection", style: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20" };
      case "MATHEMATICAL_CONNECTION":
        return { label: "Mathematical Connection", style: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20" };
      case "CAUSAL_CONNECTION":
        return { label: "Causal Connection", style: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" };
      case "SHARED_PRINCIPLE":
        return { label: "Shared Principle", style: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" };
      default:
        return { label: type.replace(/_/g, " "), style: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20" };
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
          <GitBranch className="w-4 h-4" />
          <span>The Knowledge Lattice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 dark:text-slate-100">
          Cross-Domain Connections & Isomorphisms
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
          Meaningful relationships linking concepts across disparate fields. We strictly distinguish shared mathematical structures from direct physical equivalences.
        </p>
      </div>

      {/* Connections List */}
      <div className="space-y-6">
        {connections.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            No cross-domain connections cataloged yet.
          </div>
        ) : (
          connections.map((conn) => {
            const rel = formatRelType(conn.relationshipType);
            return (
              <article
                key={conn.id}
                className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-4 hover:border-emerald-500/30 transition-all shadow-sm"
              >
                {/* Relationship Tag */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded border font-semibold ${rel.style}`}>
                    {rel.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Strength: {conn.strength.toFixed(1)}
                  </span>
                </div>

                {/* Concept Nodes Bridge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-y border-slate-100 dark:border-slate-800/80">
                  {/* From Node */}
                  <Link
                    href={`/concepts/${conn.sourceConcept.slug}`}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#151e2d]/60 dark:hover:bg-[#151e2d] border border-slate-200/70 dark:border-slate-800 space-y-1 block transition-colors group"
                  >
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {conn.sourceConcept.chapter.title}
                    </div>
                    <div className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-between">
                      <span>{conn.sourceConcept.title}</span>
                      <BookOpen className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </Link>

                  {/* To Node */}
                  <Link
                    href={`/concepts/${conn.targetConcept.slug}`}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#151e2d]/60 dark:hover:bg-[#151e2d] border border-slate-200/70 dark:border-slate-800 space-y-1 block transition-colors group"
                  >
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {conn.targetConcept.chapter.title}
                    </div>
                    <div className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-between">
                      <span>{conn.targetConcept.title}</span>
                      <BookOpen className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  </Link>
                </div>

                {/* Explanation */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Why This Bridge Matters:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {conn.explanation}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
