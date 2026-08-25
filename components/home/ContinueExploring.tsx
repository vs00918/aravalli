import React from "react";
import Link from "next/link";
import { BookMarked, ArrowRight } from "lucide-react";

export function ContinueExploring() {
  const bookmarks = [
    {
      slug: "entropy",
      title: "Entropy",
      domain: "Universe & Physics",
      currentLevel: "Level 4: First Principles",
      summary: "Exploring Boltzmann's multiplicity of states S = k_B ln Ω and why closed systems drift toward higher probability states.",
    },
    {
      slug: "emergence",
      title: "Emergence",
      domain: "Complex Systems",
      currentLevel: "Level 3: How It Works",
      summary: "How simple local rules between interacting parts produce unexpected collective patterns like market pricing and consciousness.",
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <BookMarked className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
            Continue Reading
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">Personal Reading History</span>
      </div>

      {/* Reading Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookmarks.map((item) => (
          <Link
            key={item.slug}
            href={`/concepts/${item.slug}`}
            className="group rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-4 flex flex-col justify-between space-y-3 transition-all hover:border-emerald-500/40 hover:shadow-sm block"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                  {item.domain}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {item.currentLevel}
                </span>
              </div>
              <h3 className="font-serif text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {item.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <span>Resume concept</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
