import React from "react";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";
import { RevisionHubClient } from "@/components/revision/RevisionHubClient";

export const dynamic = "force-static";

export default function RevisionPage({
  searchParams
}: {
  searchParams?: { topic?: string };
}) {
  const registry = getBankingCaRegistry();
  const initialTopicSlug = searchParams?.topic;

  return (
    <RevisionHubClient
      registry={registry}
      initialTopicSlug={initialTopicSlug}
    />
  );
}
