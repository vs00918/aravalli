import React from "react";
import { GitBranch } from "lucide-react";

export function ConnectionsPreview() {
  const connections = [
    {
      coreConcept: "Entropy & Information",
      bridges: [
        { domain: "Physics", detail: "Multiplicity of microscopic arrangements (Boltzmann: S = k_B ln Ω)" },
        { domain: "Biology", detail: "Open systems taking in energy to maintain internal order (How Life Maintains Order)" },
        { domain: "Information Theory", detail: "Shannon entropy measuring informational uncertainty (H = -∑ p_i log₂ p_i)" },
      ],
      insight:
        "The mathematical formula describing heat dissipation in physical engines is structurally isomorphic to the mathematical limit of data compression in communication channels.",
    },
    {
      coreConcept: "Negative Feedback & Homeostasis",
      bridges: [
        { domain: "Endocrinology", detail: "Insulin and glucagon counter-balancing blood sugar concentrations" },
        { domain: "Cybernetics", detail: "Thermostats and speed governors dampening oscillations" },
        { domain: "Macroeconomics", detail: "Central bank interest rate adjustments responding to inflation targets" },
      ],
      insight:
        "Biological survival and systemic stability both depend on restoring forces that oppose deviation from steady-state setpoints.",
    },
  ];

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <GitBranch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-800 dark:text-slate-200 font-mono">
            Cross-Domain Connections
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Structural Isomorphisms
        </span>
      </div>

      {/* Connection Lattice Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connections.map((conn, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] p-5 space-y-4 shadow-sm"
          >
            {/* Core Node Title */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
                Universal Principle
              </span>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-slate-900 dark:text-slate-100">
                {conn.coreConcept}
              </h3>
            </div>

            {/* Tri-Domain Connective Strata */}
            <div className="space-y-2 pt-1 border-y border-slate-100 dark:border-slate-800/80 py-3">
              {conn.bridges.map((bridge, bIdx) => (
                <div key={bIdx} className="flex items-start space-x-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {bridge.domain}:
                    </span>{" "}
                    <span className="text-slate-600 dark:text-slate-400 font-sans">
                      {bridge.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Synthesis Insight */}
            <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-[#151e2d]/60 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/60 leading-relaxed">
              <strong className="font-medium text-slate-800 dark:text-slate-200 not-italic font-sans">
                Deep Insight:
              </strong>{" "}
              &ldquo;{conn.insight}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
