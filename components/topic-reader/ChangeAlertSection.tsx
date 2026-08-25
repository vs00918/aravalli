import React from "react";
import { AlertTriangle } from "lucide-react";
import { ChangeAlert } from "@/lib/banking-ca/schema";

interface ChangeAlertSectionProps {
  alert?: ChangeAlert;
  status: string;
}

export function ChangeAlertSection({ alert, status }: ChangeAlertSectionProps) {
  if (!alert && status === "IMPLEMENTED") {
    return null;
  }

  return (
    <section className="p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2">
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>Change-Sensitive Alert / Regulatory Status ({status})</span>
      </div>

      {alert && (
        <div className="space-y-1 text-xs text-amber-200/90 font-mono leading-relaxed pl-6">
          <p>• <strong>Status Detail:</strong> {alert.currentFactSummary}</p>
          <p>• <strong>Action Required:</strong> {alert.actionBeforeExam}</p>
        </div>
      )}
    </section>
  );
}
