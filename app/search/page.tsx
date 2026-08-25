import React, { Suspense } from "react";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { SearchAndFilterView } from "@/components/search/SearchAndFilterView";

export const dynamic = "force-static";

export default function SearchIndexPage() {
  const registry = getBankingCaRegistry();

  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-[var(--text-muted)]">Loading Search Index...</div>}>
      <SearchAndFilterView registry={registry} />
    </Suspense>
  );
}
