import React from "react";
import { LibraryPreview } from "@/components/home/LibraryPreview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-emerald-500 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold">Master Library</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
          Master Library
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The core knowledge domains of Mind of Aravalli. Each chapter represents an evolving living volume of understanding.
        </p>
      </div>

      <LibraryPreview />
    </div>
  );
}
