import React from "react";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <section className="py-12 sm:py-16 md:py-20 text-center space-y-6">
      {/* Subtle Focus Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>A Living Personal Encyclopedia</span>
      </div>

      {/* Main Restrained Headline */}
      <div className="space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-serif leading-tight">
          Understand the world. <br className="hidden sm:inline" />
          <span className="text-emerald-700 dark:text-emerald-400">One connection at a time.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A personal encyclopedia where ideas from lectures, books, and deep research become connected, organized, and durable.
        </p>
      </div>

      {/* Prominent Visual Search / Exploration Input */}
      <div className="max-w-xl mx-auto pt-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="What do you want to understand? (e.g. Entropy, Emergence, Energy Density)"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] pl-11 pr-24 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-default transition-all"
            title="Search interface preview"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              Explore
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
