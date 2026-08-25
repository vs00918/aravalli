import React from "react";
import Link from "next/link";
import { HelpCircle, Compass, BookOpen, ArrowRight } from "lucide-react";
import { getAllQuestions } from "@/lib/db/questions";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const questions = await getAllQuestions();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
      case "EXPLORING":
        return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20";
      case "ANSWERED":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>Curiosity Radar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 dark:text-slate-100">
          Unresolved Questions & Research Inquiries
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
          Questions are first-class knowledge objects in Mind of Aravalli. They represent active curiosity and serve as navigational doorways into the concept graph.
        </p>
      </div>

      {/* Questions Grid */}
      <div className="space-y-5">
        {questions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-mono text-xs">
            No inquiry questions cataloged yet.
          </div>
        ) : (
          questions.map((q) => (
            <article
              key={q.id}
              className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-4 hover:border-emerald-500/30 transition-all shadow-sm"
            >
              {/* Header: Status and Chapter */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${getStatusBadge(q.status)}`}>
                  {q.status}
                </span>

                {q.chapter && (
                  <Link
                    href={`/chapters/${q.chapter.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{q.chapter.title}</span>
                  </Link>
                )}
              </div>

              {/* The Question */}
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                &ldquo;{q.question}&rdquo;
              </h2>

              {/* Description / Framing */}
              {q.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {q.description}
                </p>
              )}

              {/* Related Concept Doorway */}
              {q.relatedConcept && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                    Related Concept Doorway:
                  </span>
                  <Link
                    href={`/concepts/${q.relatedConcept.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-serif font-semibold text-emerald-700 dark:text-emerald-400 hover:underline group"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{q.relatedConcept.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
