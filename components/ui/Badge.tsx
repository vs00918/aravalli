import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "accent" | "outline" | "subtle";
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors font-mono";

  const variants = {
    default:
      "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300",
    accent:
      "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
    subtle:
      "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}
