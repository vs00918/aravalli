import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getIngestionItemById } from "@/lib/db/inbox";
import { InboxReviewDesk } from "@/components/inbox/InboxReviewDesk";

export const dynamic = "force-dynamic";

interface InboxItemPageProps {
  params: {
    id: string;
  };
}

export default async function InboxItemPage({ params }: InboxItemPageProps) {
  const item = await getIngestionItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <InboxReviewDesk item={item as any} />
    </div>
  );
}
