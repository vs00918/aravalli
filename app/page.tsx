import React from "react";
import { Hero } from "@/components/home/Hero";
import { ContinueExploring } from "@/components/home/ContinueExploring";
import { LibraryPreview } from "@/components/home/LibraryPreview";
import { RecentConcepts } from "@/components/home/RecentConcepts";
import { ConnectionsPreview } from "@/components/home/ConnectionsPreview";
import { QuestionsPreview } from "@/components/home/QuestionsPreview";

export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. Hero & Intellectual Entry */}
      <Hero />

      {/* 2. Continue Reading (Notebook bookmarks) */}
      <ContinueExploring />

      {/* 3. Master Library (Atlas & Catalog Format) */}
      <LibraryPreview />

      {/* 4. Cross-Domain Isomorphism Lattice */}
      <ConnectionsPreview />

      {/* 5. Foundational Concepts */}
      <RecentConcepts />

      {/* 6. Curiosity Radar (Open Questions) */}
      <QuestionsPreview />
    </div>
  );
}
