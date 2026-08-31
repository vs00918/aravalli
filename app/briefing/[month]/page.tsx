import React from "react";
import { getBankingCaRegistry, getTopicsByMonth } from "@/lib/banking-ca/data";
import { BriefingStreamView } from "@/components/briefing/BriefingStreamView";
import { AugustMagazineView } from "@/components/briefing/AugustMagazineView";

export const dynamic = "force-static";

export function generateStaticParams() {
  const registry = getBankingCaRegistry();
  const indexedMonths = Object.keys(registry.indexes.byYearMonth || registry.indexes.byMonth || {});

  // Include all 12 months for 2026 Master Archive
  const allMonths = Array.from(new Set([
    ...indexedMonths,
    "2026-12",
    "2026-11",
    "2026-10",
    "2026-09",
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
  "2026-12": "December 2026",
  "2026-11": "November 2026",
  "2026-10": "October 2026",
  "2026-09": "September 2026",
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

  // Validated Magazine Architecture for August 2026 onward
  if (month >= "2026-08") {
    return (
      <AugustMagazineView
        month={month}
        monthTitle={monthTitle}
        topics={topics}
        registry={registry}
        initialPriority={searchParams?.priority}
      />
    );
  }

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
