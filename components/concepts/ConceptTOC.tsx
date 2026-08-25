import React from "react";
import { ListTree } from "lucide-react";

export function ConceptTOC() {
  const layers = [
    { id: "layer-core-idea", label: "1. The Core Idea" },
    { id: "why-it-matters", label: "Why It Matters" },
    { id: "layer-intuition", label: "2. Build Intuition" },
    { id: "layer-mechanism", label: "3. Mechanism" },
    { id: "layer-first-principles", label: "4. First Principles" },
    { id: "layer-mathematics", label: "5. Mathematics" },
    { id: "layer-connections", label: "6. Where It Connects" },
    { id: "limitations", label: "Limitations & Nuance" },
    { id: "sources", label: "Source Provenance" },
    { id: "related-questions", label: "Curiosity Questions" },
  ];

  return (
    <aside className="hidden xl:block w-52 shrink-0">
      <div className="sticky top-24 space-y-3">
        <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
          <ListTree className="w-3.5 h-3.5" />
          <span>On This Page</span>
        </div>

        <nav className="space-y-1 font-mono text-xs">
          {layers.map((layer) => (
            <a
              key={layer.id}
              href={`#${layer.id}`}
              className="block py-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-[#151e2d] text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors truncate"
            >
              {layer.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
