import React from "react";
import { AlertTriangle } from "lucide-react";
import { ChangeAlert, RegulatoryStatus } from "@/lib/banking-ca/schema";

interface ChangeAlertSectionProps {
  alert?: ChangeAlert | string;
  status?: RegulatoryStatus;
}

export function ChangeAlertSection({ alert, status }: ChangeAlertSectionProps) {
  const isDraftOrProposal = status === "DRAFT" || status === "PROPOSAL";

  const alertText = typeof alert === "string" 
    ? alert 
    : alert?.isChangeSensitive 
    ? alert.currentFactSummary 
    : "";

  if (!alertText && !isDraftOrProposal) {
    return null;
  }

  return (
    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 font-sans leading-relaxed select-none">
      <AlertTriangle className="w-4 h-4 text-amber-800 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        {isDraftOrProposal && (
          <span className="font-mono font-bold mr-1.5 uppercase">
            [{status} Stage — Subject to Final Notification]
          </span>
        )}
        <span>{alertText || "This regulation is in draft/proposal stage. Verify final status before examination."}</span>
      </div>
    </div>
  );
}
