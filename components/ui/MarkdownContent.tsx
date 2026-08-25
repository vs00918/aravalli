import React from "react";
import { MathBlock, MathInline } from "@/components/ui/MathBlock";
import { Sparkles, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  if (!content) return null;

  const formatInline = (text: string): React.ReactNode[] => {
    // Regex matching inline math $...$, bold **...**, italic *...*, and inline code `...`
    const parts = text.split(/(\$[^\$]+\$|\*\*[^\*]+\*\*|\*[^\*]+\*|`[^`]+`)/g);

    return parts.map((part, i) => {
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        return <MathInline key={i} math={part.slice(1, -1)} />;
      }
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={i} className="italic text-slate-800 dark:text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={i}
            className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let listItems: React.ReactNode[] = [];

  let inTable = false;
  let tableRows: string[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushList = () => {
    if (inList) {
      if (listType === "ol") {
        elements.push(
          <ol
            key={`ol-${elements.length}`}
            className="space-y-2 my-3 pl-5 list-decimal text-sm sm:text-base marker:text-emerald-600 dark:marker:text-emerald-400 font-sans"
          >
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${elements.length}`}
            className="space-y-2 my-3 pl-5 list-disc text-sm sm:text-base marker:text-emerald-600 dark:marker:text-emerald-400 font-sans"
          >
            {listItems}
          </ul>
        );
      }
      inList = false;
      listItems = [];
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div
          key={`table-${elements.length}`}
          className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            {tableRows.map((r, rIdx) => {
              const cols = r
                .split("|")
                .filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
              if (rIdx === 0) {
                return (
                  <thead
                    key={rIdx}
                    className="bg-slate-100 dark:bg-slate-800/90 font-mono text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    <tr>
                      {cols.map((c, cIdx) => (
                        <th
                          key={cIdx}
                          className="p-3 border border-slate-200 dark:border-slate-800 font-bold"
                        >
                          {formatInline(c.trim())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                );
              }
              return (
                <tbody key={rIdx}>
                  <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {cols.map((c, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-3 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                      >
                        {formatInline(c.trim())}
                      </td>
                    ))}
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      );
      inTable = false;
      tableRows = [];
    }
  };

  const flushCodeBlock = () => {
    if (inCodeBlock) {
      elements.push(
        <pre
          key={`code-${elements.length}`}
          className="my-4 p-4 rounded-xl bg-slate-900 text-slate-100 dark:bg-[#070b12] text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed shadow-sm"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      inCodeBlock = false;
      codeLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    if (trimmed === "---") {
      flushList();
      flushTable();
      elements.push(
        <hr
          key={`hr-${elements.length}`}
          className="my-6 border-slate-200 dark:border-slate-800"
        />
      );
      continue;
    }

    // Standalone KaTeX block
    if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
      flushList();
      flushTable();
      const mathExpr = trimmed.slice(2, -2).trim();
      elements.push(<MathBlock key={`math-${elements.length}`} math={mathExpr} />);
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      flushTable();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white pt-5 pb-1 border-b border-slate-200 dark:border-slate-800"
        >
          {formatInline(trimmed.replace("### ", ""))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      flushList();
      flushTable();
      elements.push(
        <h4
          key={`h4-${elements.length}`}
          className="text-base sm:text-lg font-serif font-semibold text-slate-900 dark:text-white pt-3 pb-0.5"
        >
          {formatInline(trimmed.replace("#### ", ""))}
        </h4>
      );
      continue;
    }

    // Misconception Callouts
    if (trimmed.startsWith("**MISCONCEPTION**:")) {
      flushList();
      flushTable();
      elements.push(
        <div
          key={`misc-${elements.length}`}
          className="my-4 rounded-xl border border-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-1 font-sans"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
            Common Misconception
          </span>
          <p className="text-sm font-serif font-semibold text-slate-900 dark:text-white pt-1">
            {formatInline(trimmed.replace("**MISCONCEPTION**:", "").trim())}
          </p>
        </div>
      );
      continue;
    }
    if (trimmed.startsWith("**CORRECTION**:")) {
      flushList();
      flushTable();
      elements.push(
        <div
          key={`corr-${elements.length}`}
          className="my-4 rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 space-y-1 font-sans"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Scientific Correction
          </span>
          <p className="text-sm text-slate-800 dark:text-slate-200 pt-1">
            {formatInline(trimmed.replace("**CORRECTION**:", "").trim())}
          </p>
        </div>
      );
      continue;
    }
    if (trimmed.startsWith("**WHY THE CONFUSION HAPPENS**:")) {
      flushList();
      flushTable();
      elements.push(
        <div
          key={`why-${elements.length}`}
          className="my-3 p-3 rounded-lg border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10 text-xs text-slate-600 dark:text-slate-400 font-sans"
        >
          <strong className="text-slate-800 dark:text-slate-200 font-mono">
            Why Confusion Happens:{" "}
          </strong>
          {formatInline(trimmed.replace("**WHY THE CONFUSION HAPPENS**:", "").trim())}
        </div>
      );
      continue;
    }

    // Tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (trimmed.includes("---")) continue;
      flushList();
      inTable = true;
      tableRows.push(trimmed);
      continue;
    } else {
      flushTable();
    }

    // Unordered Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList || listType !== "ul") {
        flushList();
        inList = true;
        listType = "ul";
      }
      listItems.push(
        <li key={`li-${listItems.length}`} className="leading-relaxed">
          {formatInline(trimmed.replace(/^[-*]\s+/, ""))}
        </li>
      );
      continue;
    }

    // Ordered Lists
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList || listType !== "ol") {
        flushList();
        inList = true;
        listType = "ol";
      }
      listItems.push(
        <li key={`li-${listItems.length}`} className="leading-relaxed">
          {formatInline(trimmed.replace(/^\d+\.\s+/, ""))}
        </li>
      );
      continue;
    }

    // Standard Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200 my-3"
      >
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();
  flushCodeBlock();

  return (
    <div className={`font-serif leading-relaxed text-slate-800 dark:text-slate-200 ${className}`}>
      {elements}
    </div>
  );
}
