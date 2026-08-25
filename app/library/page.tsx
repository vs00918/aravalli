import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, ArrowRight } from "lucide-react";
import { getAllChapters } from "@/lib/db/chapters";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const chapters = await getAllChapters();

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold">Master Library</span>
      </div>

      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
          <Compass className="w-4 h-4" />
          <span>Knowledge Atlas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
          Master Library
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans max-w-2xl">
          The 5 consolidated living volumes of Mind of Aravalli. Each chapter represents an evolving body of first-principles understanding.
        </p>
      </div>

      {/* Dynamic Chapter Catalog */}
      <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80 border-y border-slate-200/80 dark:border-slate-800/80">
        {chapters.map((chapter) => {
          const conceptCount = chapter._count?.concepts ?? 0;
          return (
            <Link
              key={chapter.id}
              href={`/chapters/${chapter.slug}`}
              className="group py-6 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors hover:bg-slate-100/50 dark:hover:bg-[#0f1520]/60 -mx-4 px-4 rounded-xl block"
            >
              {/* Left: Volume Index & Title */}
              <div className="md:w-5/12 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Volume {String(chapter.order).padStart(2, "0")}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-base">{chapter.icon}</span>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {chapter.title}
                  </h2>
                </div>

                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {conceptCount} {conceptCount === 1 ? "Concept" : "Concepts"} Documented
                </div>
              </div>

              {/* Right: Description & Affordance */}
              <div className="md:w-6/12 flex flex-col justify-between space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  {chapter.description}
                </p>
                <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <span>Enter volume</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
