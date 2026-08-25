import React from "react";
import Link from "next/link";
import { BookOpen, ArrowUpRight, FileText } from "lucide-react";
import { SourceConcept } from "@/lib/types";

interface ConceptSourcesProps {
  sources?: SourceConcept[];
}

export function ConceptSources({ sources = [] }: ConceptSourcesProps) {
  if (!sources || sources.length === 0) {
    return (
      <section id="sources" className="scroll-mt-20 space-y-3 pt-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
          <BookOpen className="w-4 h-4" />
          <span>Source Provenance</span>
        </div>
        <p className="text-xs font-mono text-slate-400 italic">
          First-principles scientific synthesis from established standard literature. Primary research citations will be linked here as literature ingestion proceeds.
        </p>
      </section>
    );
  }

  return (
    <section id="sources" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-slate-300 font-bold">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Source Provenance</span>
        </div>
        <Link
          href="/sources"
          className="text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>All Sources Catalog</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {sources.map((sc, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-2 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
                    {sc.source?.type ?? "SOURCE"}
                  </span>
                  {sc.relevance && (
                    <span className="text-[10px] font-mono text-slate-400">
                      · {sc.relevance}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-serif font-semibold text-slate-900 dark:text-slate-100">
                  {sc.source?.title}
                </h4>
                {sc.source?.author && (
                  <p className="text-xs font-mono text-slate-500">
                    By {sc.source.author} {sc.source.publisher && `(${sc.source.publisher})`}
                  </p>
                )}
              </div>

              {sc.source?.url && (
                <a
                  href={sc.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  title="Open source link"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>

            {sc.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800/80">
                {sc.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
