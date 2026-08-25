import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBankingCaRegistry, getTopicsByMonth } from "@/lib/banking-ca/data";
import { BriefingStreamView } from "@/components/briefing/BriefingStreamView";

export const dynamic = "force-static";

export function generateStaticParams() {
  const registry = getBankingCaRegistry();
  const months = Object.keys(registry.indexes.byYearMonth || registry.indexes.byMonth || {});
  
  // Include standard months for 2026
  const allMonths = Array.from(new Set([
    ...months,
    "2026-08",
    "2026-07",
    "2026-06",
    "2026-05",
    "2026-04",
    "2026-03",
    "2026-02",
    "2026-01"
  ]));

  return allMonths.map((month) => ({
    month
  }));
}

interface BriefingPageProps {
  params: {
    month: string;
  };
  searchParams?: {
    category?: string;
    priority?: string;
  };
}

const MONTH_DISPLAY: Record<string, string> = {
  "2026-08": "August 2026",
  "2026-07": "July 2026",
  "2026-06": "June 2026",
  "2026-05": "May 2026",
  "2026-04": "April 2026",
  "2026-03": "March 2026",
  "2026-02": "February 2026",
  "2026-01": "January 2026"
};

export default function MonthBriefingPage({ params, searchParams }: BriefingPageProps) {
  const { month } = params;
  const registry = getBankingCaRegistry();
  const topics = getTopicsByMonth(month);

  const monthTitle = MONTH_DISPLAY[month] || month;

  return (
    <BriefingStreamView
      month={month}
      monthTitle={monthTitle}
      topics={topics}
      registry={registry}
      initialCategory={searchParams?.category}
      initialPriority={searchParams?.priority}
    />
  );
}
