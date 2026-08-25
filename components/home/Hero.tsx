"use client";

import React from "react";
import { Search, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 text-center overflow-hidden">
      {/* Subtle Geological Strata SVG Background Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-25 z-0">
        <svg
          width="720"
          height="280"
          viewBox="0 0 720 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-2xl text-emerald-800/20 dark:text-emerald-500/10"
        >
          {/* Topographic Contour Lines */}
          <path
            d="M20 220C120 180 240 240 360 200C480 160 600 210 700 180"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M40 170C150 130 260 190 380 140C500 90 620 160 680 130"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M80 120C190 80 300 130 420 90C540 50 630 100 660 80"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 3"
          />
          {/* Constellation Nodes */}
          <circle cx="360" cy="200" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="380" cy="140" r="2.5" fill="currentColor" opacity="0.8" />
          <circle cx="420" cy="90" r="3.5" fill="currentColor" opacity="0.9" />
          <circle cx="260" cy="190" r="2" fill="currentColor" opacity="0.5" />
          <line
            x1="360"
            y1="200"
            x2="380"
            y2="140"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.4"
          />
          <line
            x1="380"
            y1="140"
            x2="420"
            y2="90"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="relative z-10 space-y-6 max-w-3xl mx-auto px-4">
        {/* Restrained Eyebrow / Provenance */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-[#111622] border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>A Living Personal Encyclopedia</span>
        </div>

        {/* Poetic Intellectual Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal font-serif tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            A living map of <br />
            <span className="italic font-serif text-emerald-800 dark:text-emerald-400">
              what you understand.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-sans leading-relaxed pt-1">
            The ideas you discover shouldn&rsquo;t disappear. Extract the first principles, trace the connections, and build durable understanding.
          </p>
        </div>

        {/* Tactile Search Bar */}
        <div className="max-w-lg mx-auto pt-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              readOnly
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
              placeholder="What do you want to understand? (e.g. Entropy, Energy Density, Emergence)"
              className="w-full rounded-xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-[#0f1520] pl-11 pr-24 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer transition-all"
              title="Search (Ctrl+K)"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                Ctrl K
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
