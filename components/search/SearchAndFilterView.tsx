"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  BankingCaMasterRegistry, 
  PriorityLevel, 
  CategoryId, 
  InstitutionId, 
  RegulatoryStatus 
} from "@/lib/banking-ca/schema";
import { 
  searchCanonicalTopics, 
  SearchFilterCriteria, 
  SearchResultItem 
} from "@/lib/banking-ca/search-engine";
import { 
  revisionRepository, 
  TopicRevisionRecord 
} from "@/lib/banking-ca/revision-state";
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  Landmark, 
  Tag, 
  Calendar, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";

interface SearchAndFilterViewProps {
  registry: BankingCaMasterRegistry;
}

export function SearchAndFilterView({ registry }: SearchAndFilterViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load URL state
  const initialQuery = searchParams.get("q") || "";
  const initialPriority = (searchParams.get("priority") as any) || "ALL";
  const initialCategory = (searchParams.get("category") as any) || "ALL";
  const initialInstitution = (searchParams.get("institution") as any) || "ALL";
  const initialMonth = searchParams.get("month") || "ALL";
  const initialStatus = (searchParams.get("status") as any) || "ALL";
  const initialChange = searchParams.get("change") === "true";
  const initialRevision = (searchParams.get("revision") as any) || "ALL";
  const initialSort = (searchParams.get("sort") as any) || "RELEVANCE";

  const [query, setQuery] = useState(initialQuery);
  const [priority, setPriority] = useState<'ALL' | PriorityLevel>(initialPriority);
  const [category, setCategory] = useState<'ALL' | CategoryId>(initialCategory);
  const [institution, setInstitution] = useState<'ALL' | InstitutionId>(initialInstitution);
  const [month, setMonth] = useState<string>(initialMonth);
  const [regulatoryStatus, setRegulatoryStatus] = useState<'ALL' | RegulatoryStatus>(initialStatus);
  const [changeSensitiveOnly, setChangeSensitiveOnly] = useState<boolean>(initialChange);
  const [revisionStatus, setRevisionStatus] = useState<'ALL' | 'UNREVIEWED' | 'WEAK' | 'REVIEWED' | 'MASTERED'>(initialRevision);
  const [sortBy, setSortBy] = useState<'RELEVANCE' | 'PRIORITY' | 'NEWEST' | 'TIME' | 'ALPHA'>(initialSort);

  const [userState, setUserState] = useState<Record<string, TopicRevisionRecord>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    // Load student revision records on client
    setUserState(revisionRepository.getAllRecords());
  }, []);

  // Synchronize URL parameters on search state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (priority !== "ALL") params.set("priority", priority);
    if (category !== "ALL") params.set("category", category);
    if (institution !== "ALL") params.set("institution", institution);
    if (month !== "ALL") params.set("month", month);
    if (regulatoryStatus !== "ALL") params.set("status", regulatoryStatus);
    if (changeSensitiveOnly) params.set("change", "true");
    if (revisionStatus !== "ALL") params.set("revision", revisionStatus);
    if (sortBy !== "RELEVANCE") params.set("sort", sortBy);

    const queryString = params.toString();
    const targetUrl = queryString ? `/search?${queryString}` : "/search";
    window.history.replaceState(null, "", targetUrl);
  }, [query, priority, category, institution, month, regulatoryStatus, changeSensitiveOnly, revisionStatus, sortBy]);

  // Execute deterministic search query
  const searchResults: SearchResultItem[] = useMemo(() => {
    const criteria: SearchFilterCriteria = {
      query,
      priority,
      category,
      institution,
      month,
      regulatoryStatus,
      changeSensitiveOnly,
      revisionStatus,
      sortBy
    };
    return searchCanonicalTopics(criteria, registry, userState);
  }, [query, priority, category, institution, month, regulatoryStatus, changeSensitiveOnly, revisionStatus, sortBy, registry, userState]);

  // Helper to clear all filters
  const handleClearAll = () => {
    setQuery("");
    setPriority("ALL");
    setCategory("ALL");
    setInstitution("ALL");
    setMonth("ALL");
    setRegulatoryStatus("ALL");
    setChangeSensitiveOnly(false);
    setRevisionStatus("ALL");
    setSortBy("RELEVANCE");
  };

  const hasActiveFilters = 
    query || 
    priority !== "ALL" || 
    category !== "ALL" || 
    institution !== "ALL" || 
    month !== "ALL" || 
    regulatoryStatus !== "ALL" || 
    changeSensitiveOnly || 
    revisionStatus !== "ALL" || 
    sortBy !== "RELEVANCE";

  const categories = Object.keys(registry.indexes.byCategory).sort();
  const institutions = Object.keys(registry.indexes.byInstitution).sort();
  const months = Object.keys(registry.indexes.byMonth).sort().reverse();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <Search className="w-4 h-4" />
          <span>Knowledge Exploration &amp; Global Search</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
          Search Current Affairs
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Instant deterministic search across titles, must-memorize facts, institutions, and regulatory directions.
        </p>
      </div>

      {/* Main Search Input Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-[var(--text-subtle)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords (e.g. 'repo rate', 'NBFC upper layer', 'Tata Sons', 'PM-KISAN', 'Fields Medals')..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-3.5 text-[var(--text-subtle)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Sample Queries */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-[var(--text-subtle)] pl-1">
          <span>Try:</span>
          {["RBI", "monetary policy", "Tata Sons", "SEBI", "PM-KISAN", "BMIP"].map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2 py-0.5 rounded-md bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-emerald-300 border border-[var(--border-primary)] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Primary & Advanced Filter Toolbar */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-primary)] space-y-4">
        {/* Top Quick Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          {/* Priority Filter */}
          <div>
            <label className="block text-[10px] text-[var(--text-subtle)] uppercase mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              aria-label="Filter by Priority"
              className="w-full p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1_CRITICAL_DEEP">P1 — Critical</option>
              <option value="P2_HIGH">P2 — High</option>
              <option value="P3_MODERATE">P3 — Moderate</option>
            </select>
          </div>

          {/* Institution Filter */}
          <div>
            <label className="block text-[10px] text-[var(--text-subtle)] uppercase mb-1">Institution</label>
            <select
              value={institution}
              onChange={(e) => setInstitution(e.target.value as any)}
              aria-label="Filter by Institution"
              className="w-full p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Institutions</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-[10px] text-[var(--text-subtle)] uppercase mb-1">Timeline Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Filter by Month"
              className="w-full p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] text-[var(--text-subtle)] uppercase mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort Order"
              className="w-full p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
            >
              <option value="RELEVANCE">Relevance</option>
              <option value="PRIORITY">Priority (P1 → P3)</option>
              <option value="NEWEST">Event Date</option>
              <option value="TIME">Revision Effort</option>
              <option value="ALPHA">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Toggle Advanced Filters */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-primary)]/80 text-xs font-mono">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvancedFilters ? "Hide Extended Filters" : "Show Extended Filters"}</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Advanced Filters Expandable Drawer */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--border-primary)] text-xs font-mono">
            {/* Category Filter */}
            <div>
              <label className="block text-[10px] text-[var(--text-subtle)] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                aria-label="Filter by Category"
                className="w-full p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Regulatory Status Filter */}
            <div>
              <label className="block text-[10px] text-[var(--text-subtle)] uppercase mb-1">Regulatory Status</label>
              <select
                value={regulatoryStatus}
                onChange={(e) => setRegulatoryStatus(e.target.value as any)}
                aria-label="Filter by Regulatory Status"
                className="w-full p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="APPROVED">Approved</option>
                <option value="IMPLEMENTED">Implemented</option>
              </select>
            </div>

            {/* Personal Study State Filter */}
            <div>
              <label className="block text-[10px] text-[var(--text-subtle)] uppercase mb-1">Personal Revision State</label>
              <select
                value={revisionStatus}
                onChange={(e) => setRevisionStatus(e.target.value as any)}
                aria-label="Filter by Revision State"
                className="w-full p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Topics</option>
                <option value="UNREVIEWED">Unreviewed</option>
                <option value="WEAK">Weak (Marked AGAIN/HARD)</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="MASTERED">Mastered (EASY)</option>
              </select>
            </div>

            {/* Change Sensitive Toggle */}
            <div className="sm:col-span-3 flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={changeSensitiveOnly}
                  onChange={(e) => setChangeSensitiveOnly(e.target.checked)}
                  className="rounded bg-[var(--surface-elevated)] border-[var(--border-primary)] text-emerald-500 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Show Change-Sensitive Alerts Only</span>
                </span>
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Results Header Summary */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1">
        <span>
          Showing <strong className="text-[var(--text-primary)]">{searchResults.length}</strong> Topics
        </span>
        {hasActiveFilters && (
          <span className="text-emerald-400">
            Filtered from {registry.summary.totalCanonicalTopics} Total
          </span>
        )}
      </div>

      {/* Results List */}
      {searchResults.length > 0 ? (
        <div className="space-y-3">
          {searchResults.map(({ topic, matchingFields, snippet, userRecord }) => {
            const isP1 = topic.priority.startsWith("P1");
            const isP2 = topic.priority === "P2_HIGH";

            const priorityColor = isP1
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
              : isP2
              ? "bg-amber-950/40 text-amber-400 border-amber-800/40"
              : "bg-slate-900 text-slate-400 border-slate-700/40";

            return (
              <div
                key={topic.id}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] hover:border-emerald-800/40 transition-all space-y-2.5"
              >
                {/* Result Card Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${priorityColor}`}>
                      {topic.priority.replace(/_/g, " ")}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-primary)] text-[var(--text-muted)] text-[11px]">
                      {topic.primaryInstitution}
                    </span>
                    <span className="text-[var(--text-subtle)] text-[11px]">
                      {topic.primaryCategory.replace(/_/g, " ")}
                    </span>
                    {topic.regulatoryStatus !== "IMPLEMENTED" && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950/30 text-amber-400 border border-amber-800/40 text-[10px] font-bold">
                        {topic.regulatoryStatus}
                      </span>
                    )}
                    {userRecord && userRecord.isWeak && (
                      <span className="px-1.5 py-0.2 rounded bg-red-950/40 text-red-300 border border-red-800/40 text-[10px] font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> Weak
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[var(--text-subtle)] text-[11px]">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>~{topic.revisionMinutes} min</span>
                  </div>
                </div>

                {/* Title */}
                <Link
                  href={`/topics/${topic.slug}`}
                  className="block font-serif font-bold text-sm sm:text-base text-[var(--text-primary)] hover:text-emerald-400 transition-colors"
                >
                  {topic.title}
                </Link>

                {/* Match Snippet */}
                {snippet && (
                  <p className="text-xs font-mono text-[var(--text-muted)] line-clamp-2 leading-relaxed bg-[var(--surface-elevated)] p-2.5 rounded-xl border border-[var(--border-primary)]">
                    • {snippet}
                  </p>
                )}

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <div className="text-[10px] text-[var(--text-subtle)]">
                    {matchingFields.length > 0 && (
                      <span>Matched in: {matchingFields.slice(0, 2).join(", ")}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/revision?topic=${topic.slug}`}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Revise</span>
                    </Link>
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="text-[var(--text-primary)] hover:text-emerald-400 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Read Note</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Zero Results Empty State */
        <div className="p-8 rounded-3xl bg-[var(--surface-primary)] border border-[var(--border-primary)] text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-subtle)]">
            <Search className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-base text-[var(--text-primary)]">
            No Canonical Topics Found
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto font-sans">
            No topics matched your query and filter criteria. Try searching with a broader keyword, selecting an institution, or clearing active filters.
          </p>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-colors inline-flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
