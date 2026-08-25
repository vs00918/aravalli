import React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function RecentConcepts() {
  const concepts = [
    {
      title: "Entropy",
      chapter: "Universe & Physics",
      definition:
        "A measure related to how many microscopic configurations are compatible with the macroscopic state.",
      whyItMatters:
        "Explains the arrow of time, irreversible thermodynamic dissipation, and maximum information bounds.",
    },
    {
      title: "Energy Density",
      chapter: "Energy & Technology",
      definition:
        "The quantity of accessible energy stored per unit volume (Wh/L) or per unit mass (Wh/kg).",
      whyItMatters:
        "The primary physical bottleneck dictating what can fly, what can drive, and what can run on the electrical grid.",
    },
    {
      title: "Homeostasis",
      chapter: "Complex Systems & Human Body",
      definition:
        "The state of dynamic steady-state equilibrium maintained by self-regulating internal physiological processes.",
      whyItMatters:
        "The master cybernetic loop preventing biological organisms from decaying into thermodynamic disorder.",
    },
    {
      title: "Feedback Loops",
      chapter: "Complex Systems & Human Body",
      definition:
        "A circular causal chain where the system's output is routed back as an input, creating amplification or stabilization.",
      whyItMatters:
        "Governs everything from insulin regulation in biology to audio screeching and runaway financial panics.",
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 font-mono">
            Recently Added Concepts
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Foundation Corpus</span>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {concepts.map((concept, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 text-left transition-all hover:border-emerald-500/40 hover:shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  {concept.chapter}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {concept.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {concept.definition}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                <strong className="font-medium text-slate-700 dark:text-slate-300 not-italic">
                  Why it matters:
                </strong>{" "}
                {concept.whyItMatters}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
