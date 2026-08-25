import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

export function Card({
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 text-slate-900 dark:text-slate-100 shadow-sm transition-all",
        hoverable &&
          "hover:border-emerald-500/40 hover:shadow-md dark:hover:bg-[#161d2b] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
