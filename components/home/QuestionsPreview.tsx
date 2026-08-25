import React from "react";
import { HelpCircle } from "lucide-react";

export function QuestionsPreview() {
  const questions = [
    {
      question: "Why does time appear to move in only one direction?",
      domain: "Universe & Physics",
      hint: "Tied to low entropy at the Big Bang boundary and macroscopic statistical counting.",
    },
    {
      question: "How does inanimate chemistry cross the threshold to become living software?",
      domain: "Biology & Life",
      hint: "Autocatalytic molecular networks, compartmentalization, and hereditary genetic encoding.",
    },
    {
      question: "Why do complex systems develop collective behavior their individual components don't possess?",
      domain: "Complex Systems",
      hint: "Non-linear feedback loops, phase transitions, and scale-dependent emergence.",
    },
    {
      question: "Why does fiat money retain value in the absence of a physical commodity standard?",
      domain: "Society, Money & Mind",
      hint: "State tax-coercion obligations, Nash equilibrium focal points, and shared institutional belief.",
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 font-mono">
            Questions to Explore
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Curiosity Radar</span>
      </div>

      {/* Questions List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 text-left space-y-2.5 transition-all hover:border-emerald-500/40 hover:shadow-sm"
          >
            <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-semibold">
              {q.domain}
            </span>

            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 font-serif leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              &ldquo;{q.question}&rdquo;
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {q.hint}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
