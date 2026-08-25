import React from "react";
import { Binary } from "lucide-react";
import { MathBlock, MathInline } from "@/components/ui/MathBlock";

interface ConceptMathematicsProps {
  mathematicalModel?: string | null;
}

export function ConceptMathematics({ mathematicalModel }: ConceptMathematicsProps) {
  if (!mathematicalModel) return null;

  // Split by markdown blocks / sections
  const renderMathContent = (content: string) => {
    const paragraphs = content.split("\n\n");

    return paragraphs.map((para, idx) => {
      const trimmed = para.trim();

      // Heading 3
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-base sm:text-lg font-serif font-semibold text-slate-900 dark:text-slate-100 pt-3 pb-1"
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
            className="text-sm sm:text-base font-serif font-medium text-slate-800 dark:text-slate-200 pt-2 pb-0.5"
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

      // Direct LaTeX expression without markdown wrapper
      if (trimmed.startsWith("\\") || trimmed.includes("=") && (trimmed.includes("\\") || trimmed.length < 80 && !trimmed.includes(" "))) {
        return <MathBlock key={idx} math={trimmed} />;
      }

      // Bullet Lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map((item) => item.replace(/^[-*]\s+/, ""));
        return (
          <ul key={idx} className="space-y-1.5 list-disc list-inside text-sm text-slate-700 dark:text-slate-300 font-sans pl-1">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed">
                {renderInlineMath(item)}
              </li>
            ))}
          </ul>
        );
      }

      // Regular Paragraph with potential inline math
      return (
        <p key={idx} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
          {renderInlineMath(trimmed)}
        </p>
      );
    });
  };

  // Helper to render inline math like $...$ or simple math tokens
  const renderInlineMath = (text: string) => {
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        const inlineExpr = part.slice(1, -1);
        return <MathInline key={i} math={inlineExpr} className="mx-1" />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section id="layer-mathematics" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <Binary className="w-4 h-4" />
        <span>Level 5 · The Mathematics</span>
      </div>

      <div className="space-y-3">
        {renderMathContent(mathematicalModel)}
      </div>
    </section>
  );
}
