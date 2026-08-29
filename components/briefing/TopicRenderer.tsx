"use client";

import React from "react";
import { CanonicalTopic } from "@/lib/banking-ca/schema";
import { classifyTopicPresentation } from "@/lib/banking-ca/presentation-classifier";
import { DeepBrief } from "./primitives/DeepBrief";
import { Brief } from "./primitives/Brief";
import { MetricCallout } from "./primitives/MetricCallout";
import { EventRow } from "./primitives/EventRow";
import { FactStrip } from "./primitives/FactStrip";

interface TopicRendererProps {
  topic: CanonicalTopic;
  isRead: boolean;
  onToggleRead: (slug: string) => void;
}

export function TopicRenderer({ topic, isRead, onToggleRead }: TopicRendererProps) {
  const primitive = classifyTopicPresentation(topic);

  switch (primitive) {
    case "DeepBrief":
      return <DeepBrief topic={topic} isRead={isRead} onToggleRead={onToggleRead} />;
    case "MetricCallout":
      return <MetricCallout topic={topic} isRead={isRead} onToggleRead={onToggleRead} />;
    case "EventRow":
      return <EventRow topic={topic} isRead={isRead} onToggleRead={onToggleRead} />;
    case "FactStrip":
      return <FactStrip topic={topic} isRead={isRead} onToggleRead={onToggleRead} />;
    case "Brief":
    default:
      return <Brief topic={topic} isRead={isRead} onToggleRead={onToggleRead} />;
  }
}
