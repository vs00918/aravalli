import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 transition-all ${className}`}
      aria-label="Mind of Aravalli — Home"
    >
      {/* Aravalli Geological Ridge Brandmark */}
      <div className="w-8 h-8 rounded-lg bg-emerald-950/60 dark:bg-emerald-950/80 border border-emerald-800/40 dark:border-emerald-700/50 flex items-center justify-center shadow-sm group-hover:border-emerald-500/60 transition-colors">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors"
          aria-hidden="true"
        >
          {/* Layered mountain ridges */}
          <path
            d="M3 19L9.5 8.5L14 15L17 10.5L21 19H3Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 8.5L12 13M17 10.5L18.5 13.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors font-sans">
            Mind of Aravalli
          </span>
          <span className="text-[10px] tracking-wider uppercase text-slate-500 dark:text-slate-400 font-mono">
            Personal Encyclopedia
          </span>
        </div>
      )}
    </Link>
  );
}
