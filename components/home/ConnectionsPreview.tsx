import React from "react";
import { GitFork, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function ConnectionsPreview() {
  const connections = [
    {
      title: "Thermodynamic Negentropy",
      from: "Physics (Entropy)",
      to: "Biology (Living Order)",
      type: "analogous_to",
      explanation:
        "Erwin Schrödinger’s insight: Life avoids thermodynamic decay to equilibrium by continuously extracting 'negative entropy' from its metabolic environment.",
    },
    {
      title: "Stabilizing Cybernetic Loops",
      from: "Biology (Homeostasis)",
      to: "Economics (Macro Markets)",
      type: "shared_principle",
      explanation:
        "Negative feedback loops in endocrinology (insulin/glucagon) share the identical stabilizing mathematics as central bank interest rate interventions.",
    },
    {
      title: "Preferential Attachment & Power Laws",
      from: "Complex Systems (Networks)",
      to: "Society (Wealth Distribution)",
      type: "mathematically_related_to",
      explanation:
        "Scale-free network topology ('rich get richer' dynamics) models the structural growth of the World Wide Web, neural synaptic graphs, and capital accumulation.",
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <GitFork className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 font-mono">
            Cross-Domain Connections
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Structural Isomorphisms</span>
      </div>

      {/* Connections List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {connections.map((conn, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 text-left space-y-3 shadow-sm hover:border-emerald-500/30 transition-colors"
          >
            {/* Bridge Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                {conn.from.split(" ")[0]}
              </span>
              <ArrowRightLeft className="w-3 h-3 text-slate-400" />
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                {conn.to.split(" ")[0]}
              </span>
            </div>

            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              {conn.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {conn.explanation}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-400">
                Type: {conn.type.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
