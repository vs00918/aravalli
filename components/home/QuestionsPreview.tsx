import React from "react";
import { HelpCircle } from "lucide-react";

export function QuestionsPreview() {
  const inquiries = [
    {
      question: "Why does time appear to move in only one direction?",
      domain: "Universe & Physics",
      framing:
        "Microscopic laws of physics are reversible, yet the macroscopic world exhibits a strict arrow of time driven by entropy and the low-entropy boundary condition of the early universe.",
    },
    {
      question: "How does inanimate chemistry cross the threshold into self-replicating life?",
      domain: "Biology & Life",
      framing:
        "How simple organic molecules organize into membrane-bound cells that metabolize energy, store genetic instructions in DNA, and reproduce.",
    },
    {
      question: "Why do complex systems develop collective behavior their individual components do not possess?",
      domain: "Complex Systems",
      framing:
        "How simple local rules between interacting parts produce unexpected collective patterns like flocking birds, market prices, and consciousness.",
    },
    {
      question: "Why does fiat currency retain value without a physical gold standard?",
      domain: "Society, Money & Mind",
      framing:
        "How shared institutional trust, legal tender frameworks, and government tax obligations turn tokens and digital ledgers into universally accepted mediums of exchange.",
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
            Questions to Explore
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Curiosity Radar
        </span>
      </div>

      {/* Editorial Inquiries Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inquiries.map((item, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-5 space-y-2.5 transition-all hover:border-emerald-500/40 hover:shadow-sm"
          >
            <span className="text-[10px] font-mono uppercase tracking-wide text-emerald-700 dark:text-emerald-400 font-semibold">
              {item.domain}
            </span>

            <h3 className="font-serif text-lg font-normal text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
              &ldquo;{item.question}&rdquo;
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans pt-1">
              {item.framing}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
