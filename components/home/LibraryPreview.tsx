import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export function LibraryPreview() {
  const domains = [
    {
      index: "01",
      slug: "universe-physics",
      title: "Universe & Physics",
      scope:
        "The basic rules that determine how matter, energy, space and time behave.",
      constellation: ["Matter & Energy", "Atoms", "Entropy", "Quantum Unitarity"],
    },
    {
      index: "02",
      slug: "energy-technology",
      title: "Energy & Technology",
      scope:
        "How we generate, store, move and use energy to power human civilization.",
      constellation: ["What Is Energy?", "Electricity", "Energy Density", "Power Grids"],
    },
    {
      index: "03",
      slug: "biology-life",
      title: "Biology & Life",
      scope:
        "How living organisms maintain order, reproduce, and evolve across generations.",
      constellation: ["The Cell", "DNA & Code", "Maintaining Order", "Evolution"],
    },
    {
      index: "04",
      slug: "complex-systems",
      title: "Complex Systems & Human Body",
      scope:
        "How simple individual parts interact to produce unexpected collective behavior.",
      constellation: ["Feedback Loops", "Networks", "Homeostasis", "Emergence"],
    },
    {
      index: "05",
      slug: "society-money-mind",
      title: "Society, Money & Mind",
      scope:
        "How human incentives, exchange, institutions, and population dynamics shape collective life.",
      constellation: ["Incentives", "Money & Trade", "Markets", "Demographics"],
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
            Master Library
          </h2>
        </div>
        <Link
          href="/library"
          className="text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 group"
        >
          <span>All 5 Volumes</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Catalog List / Atlas Grid */}
      <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 border-y border-slate-200/80 dark:border-slate-800/80">
        {domains.map((domain) => (
          <Link
            key={domain.slug}
            href={`/chapters/${domain.slug}`}
            className="group py-5 sm:py-6 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors hover:bg-slate-100/50 dark:hover:bg-[#0f1520]/50 -mx-4 px-4 rounded-xl block"
          >
            {/* Left: Index & Title */}
            <div className="md:w-5/12 space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 opacity-90">
                  {domain.index}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  {domain.title}
                </h3>
              </div>

              {/* Constellation Topics */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {domain.constellation.map((topic, i) => (
                  <span key={i} className="inline-flex items-center">
                    <span>{topic}</span>
                    {i < domain.constellation.length - 1 && (
                      <span className="mx-1 opacity-40">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Scope Description & Action */}
            <div className="md:w-6/12 flex flex-col justify-between space-y-2">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {domain.scope}
              </p>
              <div className="flex items-center space-x-1 text-xs font-mono text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-1">
                <span>Explore volume</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
