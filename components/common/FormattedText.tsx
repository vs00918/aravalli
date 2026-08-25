import React from "react";
import { normalizePresentationText } from "@/lib/banking-ca/formatters";

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Presentation Normalizer & Inline Markdown / Symbol Renderer.
 * Cleans LaTeX math tokens, duplicate bullets, backticks, bold, and italics.
 */
export function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;

  // 1. Normalize LaTeX math tokens and leading artifacts
  const normalized = normalizePresentationText(text);

  // 2. Split by inline markdown tokens: **bold**, `code`, *italic*
  const tokens = normalized.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return (
    <span className={className}>
      {tokens.map((token, idx) => {
        // Bold token: **bold**
        if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
          return (
            <strong key={idx} className="font-bold text-[var(--text-primary)]">
              {token.slice(2, -2)}
            </strong>
          );
        }
        // Code / Threshold token: `code`
        if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-primary)] font-mono text-[0.88em] border border-[var(--border-primary)] font-bold"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        // Italic token: *italic*
        if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
          return (
            <em key={idx} className="italic text-[var(--text-primary)] font-serif">
              {token.slice(1, -1)}
            </em>
          );
        }
        return <span key={idx}>{token}</span>;
      })}
    </span>
  );
}
