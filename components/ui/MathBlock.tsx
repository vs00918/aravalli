import React from "react";
import katex from "katex";

interface MathBlockProps {
  math: string;
  className?: string;
}

export function MathBlock({ math, className = "" }: MathBlockProps) {
  let html = "";
  try {
    html = katex.renderToString(math, {
      displayMode: true,
      throwOnError: false,
      errorColor: "#047857",
    });
  } catch (err) {
    html = `<span class="text-slate-600 dark:text-slate-400 font-mono text-xs">${math}</span>`;
  }

  return (
    <div
      className={`my-4 py-3 px-4 rounded-xl bg-slate-100/70 dark:bg-[#111724] border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto text-center ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MathInline({ math, className = "" }: MathBlockProps) {
  let html = "";
  try {
    html = katex.renderToString(math, {
      displayMode: false,
      throwOnError: false,
      errorColor: "#047857",
    });
  } catch (err) {
    html = `<span class="text-slate-600 dark:text-slate-400 font-mono text-xs">${math}</span>`;
  }

  return (
    <span
      className={`inline-block align-middle ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
