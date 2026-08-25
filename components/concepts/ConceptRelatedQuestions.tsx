import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Question } from "@/lib/types";

interface ConceptRelatedQuestionsProps {
  questions?: Question[];
}

export function ConceptRelatedQuestions({ questions = [] }: ConceptRelatedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <section id="related-questions" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-slate-300 font-bold">
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Curiosity Radar · Related Questions</span>
        </div>
        <Link
          href="/questions"
          className="text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>All Questions</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-2 hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-semibold">
                {q.status}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-serif font-semibold text-slate-900 dark:text-slate-100">
              &ldquo;{q.question}&rdquo;
            </h4>

            {q.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                {q.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
