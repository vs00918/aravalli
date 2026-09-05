import React from "react";
import { Hero } from "@/components/home/Hero";
import { LibraryPreview } from "@/components/home/LibraryPreview";
import { ConnectionsPreview } from "@/components/home/ConnectionsPreview";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Hero />
      <LibraryPreview />
      <ConnectionsPreview />
    </div>
  );
}
