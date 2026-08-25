import React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-[#f9f8f5] dark:bg-[#090d13] py-12 px-4 sm:px-6 lg:px-8 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Philosophy */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
          <Logo />
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2">
            A living personal encyclopedia and epistemic laboratory. Turning scattered ideas into durable understanding.
          </p>
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <Link href="/library" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Master Library
            </Link>
            <span>•</span>
            <Link href="/explore" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Exploration
            </Link>
            <span>•</span>
            <a
              href="https://github.com/vs00918/aravalli"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="font-mono text-[11px] text-slate-400 dark:text-slate-600">
            Phase 1 • Visual Foundation
          </div>
        </div>
      </div>
    </footer>
  );
}
