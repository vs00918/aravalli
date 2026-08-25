import React from "react";
import { MathBlock, MathInline } from "@/components/ui/MathBlock";
import { Sparkles, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  if (!content) return null;

  // Process text into paragraph / block chunks
  const blocks = content.split("\n\n");

  const formatInline = (text: string): React.ReactNode[] => {
    // Regex for inline math $...$ and bold **...**
    const parts = text.split(/(\$[^\$]+\$|\*\*[^\*]+\*\*)/g);

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
        return <em key={i} className="italic text-slate-800 dark:text-slate-200">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className={`space-y-4 font-serif leading-relaxed text-slate-800 dark:text-slate-200 ${className}`}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white pt-5 pb-1 border-b border-slate-200 dark:border-slate-800"
            >
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // Heading 4
        if (trimmed.startsWith("#### ")) {
          return (
            <h4
              key={idx}
              className="text-base sm:text-lg font-serif font-semibold text-slate-900 dark:text-white pt-3 pb-0.5"
            >
              {trimmed.replace("#### ", "")}
            </h4>
          );
        }

        // Standalone Math Block $$ ... $$
        if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
          const mathExpr = trimmed.slice(2, -2).trim();
          return <MathBlock key={idx} math={mathExpr} />;
        }

        // Physical Interpretation / Insight Callout Box
        if (trimmed.startsWith("**Physical Interpretation**:") || trimmed.startsWith("**Key Insight**:")) {
          const title = trimmed.startsWith("**Physical Interpretation**:") ? "Physical Interpretation" : "Key Insight";
          const textAfter = trimmed.replace(/^\*\*(.*?)\*\*:/, "").trim();
          return (
            <div
              key={idx}
              className="my-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1520] p-4 sm:p-5 space-y-1.5 shadow-sm"
            >
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{title}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                {formatInline(textAfter)}
              </div>
            </div>
          );
        }

        // Misconception Box
        if (trimmed.startsWith("**MISCONCEPTION**:")) {
          const lines = trimmed.split("\n");
          return (
            <div
              key={idx}
              className="my-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3 shadow-sm font-sans"
            >
              {lines.map((line, lIdx) => {
                const lineTrim = line.trim();
                if (lineTrim.startsWith("**MISCONCEPTION**:")) {
                  return (
                    <div key={lIdx} className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">Common Misconception</span>
                      <p className="text-sm font-serif font-semibold text-slate-900 dark:text-white pt-1">{formatInline(lineTrim.replace("**MISCONCEPTION**:", "").trim())}</p>
                    </div>
                  );
                }
                if (lineTrim.startsWith("**CORRECTION**:")) {
                  return (
                    <div key={lIdx} className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Scientific Correction</span>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{formatInline(lineTrim.replace("**CORRECTION**:", "").trim())}</p>
                    </div>
                  );
                }
                if (lineTrim.startsWith("**WHY THE CONFUSION HAPPENS**:")) {
                  return (
                    <div key={lIdx} className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-amber-500/20">
                      <strong className="text-slate-700 dark:text-slate-300 font-mono">Why Confusion Happens: </strong>
                      <span>{formatInline(lineTrim.replace("**WHY THE CONFUSION HAPPENS**:", "").trim())}</span>
                    </div>
                  );
                }
                return <p key={lIdx} className="text-sm text-slate-700 dark:text-slate-300">{formatInline(lineTrim)}</p>;
              })}
            </div>
          );
        }

        // Bullet list
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n");
          return (
            <ul key={idx} className="space-y-2 my-3 pl-4 list-disc text-sm sm:text-base marker:text-emerald-600 dark:marker:text-emerald-400">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="leading-relaxed">
                  {formatInline(item.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split("\n");
          return (
            <ol key={idx} className="space-y-2 my-3 pl-4 list-decimal text-sm sm:text-base marker:text-emerald-600 dark:marker:text-emerald-400 font-sans">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="leading-relaxed">
                  {formatInline(item.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
