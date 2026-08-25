"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Compass, GitBranch, HelpCircle, FileText, ArrowRight } from "lucide-react";
import { SearchResultItem, SearchEntityType } from "@/lib/types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      const target = results[selectedIndex];
      onClose();
      router.push(target.url);
    }
  };

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchEntityType) => {
    switch (type) {
      case "CONCEPT":
        return <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "CHAPTER":
        return <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />;
      case "CONNECTION":
        return <GitBranch className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "QUESTION":
        return <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "SOURCE":
        return <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#fbfaf8] dark:bg-[#0b1018] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1520]/80">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search concepts, chapters, connections, questions, sources..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Search Body / Results */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading && (
            <div className="py-8 text-center text-xs font-mono text-slate-400">
              Searching knowledge graph...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center space-y-1">
              <p className="text-sm font-serif text-slate-700 dark:text-slate-300">
                No matching knowledge entities found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs font-sans text-slate-400">
                Try searching for concepts like &ldquo;Entropy&rdquo;, &ldquo;Energy&rdquo;, or &ldquo;Emergence&rdquo;
              </p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 px-4 text-center space-y-2">
              <div className="inline-flex p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Type to search across Master Volumes, Concepts, Connections, Questions, and Sources.
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1 py-1">
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onClose();
                      router.push(item.url);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-slate-900 dark:text-white"
                        : "hover:bg-slate-100/70 dark:hover:bg-[#131a26]/70 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3 overflow-hidden">
                      <div className="mt-0.5 p-1 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-serif font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {item.title}
                          </span>
                          {item.meta && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 shrink-0">
                              {item.meta}
                            </span>
                          )}
                        </div>
                        {item.snippet && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-sans">
                            {item.snippet}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center text-slate-400">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 mr-2 hidden sm:inline-block">
                        {item.type}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="px-4 py-2 bg-slate-100/60 dark:bg-[#0e141f] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>Mind of Aravalli Graph</span>
        </div>
      </div>
    </div>
  );
}
