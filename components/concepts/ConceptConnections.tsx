import React from "react";
import Link from "next/link";
import { GitFork, BookOpen, ArrowRight } from "lucide-react";
import { Connection } from "@/lib/types";

interface ConceptConnectionsProps {
  conceptSlug: string;
  outgoingConnections?: Connection[];
  incomingConnections?: Connection[];
}

export function ConceptConnections({
  conceptSlug,
  outgoingConnections = [],
  incomingConnections = [],
}: ConceptConnectionsProps) {
  // Combine all active connections for this concept
  const hasDbConnections = outgoingConnections.length > 0 || incomingConnections.length > 0;

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
    <section id="layer-connections" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
          <GitFork className="w-4 h-4" />
          <span>Level 6 · Where It Connects</span>
        </div>
        <Link
          href="/connections"
          className="text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>All Connections</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans">
          This concept forms structural bridges across multiple domains in the knowledge graph:
        </p>

        {hasDbConnections ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {outgoingConnections.map((conn) => {
              const rel = formatRelType(conn.relationshipType);
              const target = conn.targetConcept;
              return (
                <div
                  key={conn.id}
                  className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-2 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {target?.chapter?.title ?? "Connected Concept"}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${rel.style}`}>
                      {rel.label}
                    </span>
                  </div>

                  {target && (
                    <Link
                      href={`/concepts/${target.slug}`}
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-serif hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{target.title}</span>
                    </Link>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {conn.explanation}
                  </p>
                </div>
              );
            })}

            {incomingConnections.map((conn) => {
              const rel = formatRelType(conn.relationshipType);
              const source = conn.sourceConcept;
              return (
                <div
                  key={conn.id}
                  className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-2 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {source?.chapter?.title ?? "Connected Concept"}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${rel.style}`}>
                      {rel.label}
                    </span>
                  </div>

                  {source && (
                    <Link
                      href={`/concepts/${source.slug}`}
                      className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-serif hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{source.title}</span>
                    </Link>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {conn.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0f1520] text-xs font-mono text-slate-500">
            Cross-domain bridges for this concept are currently being mapped in the knowledge tree.
          </div>
        )}
      </div>
    </section>
  );
}
