import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export function RecentConcepts() {
  const concepts = [
    {
      slug: "entropy",
      title: "Entropy",
      domain: "Universe & Physics",
      definition:
        "A quantitative measure of how many microscopic arrangements are compatible with the macroscopic state we observe.",
      whyItMatters:
        "Explains the thermodynamic Arrow of Time—why heat flows from hot to cold, and why all machines have theoretical efficiency ceilings.",
    },
    {
      slug: "energy-density",
      title: "Energy Density",
      domain: "Energy & Technology",
      definition:
        "The quantity of accessible energy stored per unit volume (Wh/L) or per unit mass (Wh/kg).",
      whyItMatters:
        "The primary engineering bottleneck governing the feasibility of electric aviation, heavy haulage, and compact battery storage.",
    },
    {
      slug: "how-life-maintains-order",
      title: "How Life Maintains Order",
      domain: "Biology & Life",
      definition:
        "How open living organisms continuously take in energy and matter from their surroundings to maintain internal organization.",
      whyItMatters:
        "Provides the foundational physical perspective on what life is—an organized, self-regulating dissipation structure processing energy.",
    },
    {
      slug: "emergence",
      title: "Emergence",
      domain: "Complex Systems",
      definition:
        "The appearance of novel macroscopic behaviors in a system that cannot be predicted by analyzing individual parts in isolation.",
      whyItMatters:
        "Explains how unthinking ants build climate-controlled nests, how human markets set prices, and how neurons generate consciousness.",
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
            Recently Added Concepts
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Core Understanding
        </span>
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {concepts.map((concept) => (
          <Link
            key={concept.slug}
            href={`/concepts/${concept.slug}`}
            className="group rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all hover:border-emerald-500/40 hover:shadow-sm block"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wide text-emerald-700 dark:text-emerald-400 font-semibold">
                  {concept.domain}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {concept.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {concept.definition}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Why it matters:
                </span>{" "}
                {concept.whyItMatters}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
