import React from "react";
import Link from "next/link";
import { FileText, Book, Video, Mic, ArrowUpRight, BookOpen, Layers } from "lucide-react";
import { getAllSources } from "@/lib/db/sources";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await getAllSources();

  const getSourceIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "BOOK":
        return <Book className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "PAPER":
      case "ARTICLE":
        return <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case "YOUTUBE":
      case "VIDEO":
        return <Video className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case "PODCAST":
      case "LECTURE":
        return <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
          <FileText className="w-4 h-4" />
          <span>Knowledge Provenance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 dark:text-slate-100">
          Sources & Reference Literature
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
          The verified scientific textbooks, foundational papers, lectures, and primary materials grounding concepts across Mind of Aravalli. No fabricated citations or unverified claims.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="space-y-6">
        {sources.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            No sources cataloged yet.
          </div>
        ) : (
          sources.map((src) => (
            <article
              key={src.id}
              id={`source-${src.id}`}
              className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-4 hover:border-emerald-500/30 transition-all shadow-sm"
            >
              {/* Header: Type Badge, Author, Title */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getSourceIcon(src.type)}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
                      {src.type}
                    </span>
                    {src.publishedAt && (
                      <span className="text-xs font-mono text-slate-400">
                        {src.publishedAt}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-serif font-semibold text-slate-900 dark:text-slate-100 pt-1">
                    {src.title}
                  </h2>

                  {src.author && (
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      By <span className="font-semibold text-slate-800 dark:text-slate-200">{src.author}</span>
                      {src.publisher && ` · ${src.publisher}`}
                    </p>
                  )}
                </div>

                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
                  >
                    <span>External Link</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Description */}
              {src.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {src.description}
                </p>
              )}

              {/* Supported Concepts Tag List */}
              {src.concepts && src.concepts.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                    Grounds Concepts in Encyclopedia:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {src.concepts.map((sc) => (
                      <Link
                        key={sc.conceptId}
                        href={`/concepts/${sc.concept.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-xs font-serif text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 transition-colors"
                      >
                        <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{sc.concept.title}</span>
                        {sc.relevance && (
                          <span className="text-[9px] font-mono text-slate-400">
                            ({sc.relevance})
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
