import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Lightweight, zero-dependency inline markdown text renderer.
 * Converts **bold**, `code`, and *italic* into semantic styled HTML.
 */
export function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;

  // Split by inline markdown tokens: **bold**, `code`, *italic*
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return (
    <span className={className}>
      {tokens.map((token, idx) => {
        if (token.startsWith("**") && token.endsWith("**")) {
          return (
            <strong key={idx} className="font-bold text-[var(--text-primary)]">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("`") && token.endsWith("`")) {
          return (
            <code
              key={idx}
              className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-primary)] font-mono text-[0.88em] border border-[var(--border-primary)] font-bold"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
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
