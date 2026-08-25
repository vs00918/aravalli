import React from "react";
import { Hero } from "@/components/home/Hero";
import { ContinueExploring } from "@/components/home/ContinueExploring";
import { LibraryPreview } from "@/components/home/LibraryPreview";
import { RecentConcepts } from "@/components/home/RecentConcepts";
import { ConnectionsPreview } from "@/components/home/ConnectionsPreview";
import { QuestionsPreview } from "@/components/home/QuestionsPreview";

export default function Home() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Exploration */}
      <Hero />

      {/* 2. Continue Exploring (Recently viewed demo) */}
      <ContinueExploring />

      {/* 3. Master Library (5 Core Chapters) */}
      <LibraryPreview />

      {/* 4. Recently Added Concepts */}
      <RecentConcepts />

      {/* 5. Cross-Domain Connections */}
      <ConnectionsPreview />

      {/* 6. Questions to Explore */}
      <QuestionsPreview />
    </div>
  );
}
