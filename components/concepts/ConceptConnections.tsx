import React from "react";
import { GitFork, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Connection } from "@/lib/types";

interface ConceptConnectionsProps {
  conceptSlug: string;
  connections?: Connection[];
}

export function ConceptConnections({ conceptSlug, connections = [] }: ConceptConnectionsProps) {
  // Curated cross-domain isomorphisms for foundational concepts
  const domainTree: Record<
    string,
    Array<{ domain: string; subtopic: string; note: string; type: "isomorphism" | "physical" }>
  > = {
    entropy: [
      {
        domain: "Physics & Thermodynamics",
        subtopic: "Statistical Mechanics",
        note: "Direct physical count of accessible microstates in closed thermodynamic systems.",
        type: "physical",
      },
      {
        domain: "Information Theory",
        subtopic: "Shannon Entropy",
        note: "Isomorphic mathematical formula (H = -∑ p log p) measuring average uncertainty or informational surprise in message channels.",
        type: "isomorphism",
      },
      {
        domain: "Biology & Life",
        subtopic: "Open Dissipation Systems",
        note: "Living cells maintain internal order by exporting entropy into their surrounding environment.",
        type: "physical",
      },
      {
        domain: "Cosmology",
        subtopic: "Thermodynamic Arrow of Time",
        note: "Cosmological low-entropy initial conditions (the Big Bang) dictate why time flows forward monotonically.",
        type: "physical",
      },
    ],
    "matter-and-energy": [
      {
        domain: "Relativistic Mechanics",
        subtopic: "Mass-Energy Equivalence",
        note: "Energy and inertial mass are interconvertible properties governed by E = mc².",
        type: "physical",
      },
      {
        domain: "Nuclear Physics",
        subtopic: "Binding Energy Deficit",
        note: "Nuclear fission and fusion release binding energy by converting microscopic mass deficits into kinetic radiation.",
        type: "physical",
      },
    ],
    "how-life-maintains-order": [
      {
        domain: "Thermodynamics",
        subtopic: "Non-Equilibrium Steady States",
        note: "Continuous energy throughput sustains low-entropy metabolic structures.",
        type: "physical",
      },
      {
        domain: "Cybernetics",
        subtopic: "Homeostatic Feedback Loops",
        note: "Enzymatic and hormonal feedback dampens fluctuations to preserve biological homeostasis.",
        type: "isomorphism",
      },
    ],
    emergence: [
      {
        domain: "Statistical Physics",
        subtopic: "Phase Transitions",
        note: "Macroscopic liquid wetness or magnetism emerges from microscopic molecular spins.",
        type: "physical",
      },
      {
        domain: "Economics & Markets",
        subtopic: "Price Discovery",
        note: "Decentralized decisions of millions of consumers self-organize into equilibrium market clearing prices without central planning.",
        type: "isomorphism",
      },
      {
        domain: "Neuroscience",
        subtopic: "Consciousness & Cognition",
        note: "Subjective conscious experience arises from non-linear networks of biological neurons.",
        type: "physical",
      },
    ],
    "demographic-transition": [
      {
        domain: "Population Ecology",
        subtopic: "Carrying Capacity & Logistic Growth",
        note: "Species growth slows and plateaus as density approaches environmental constraints.",
        type: "isomorphism",
      },
      {
        domain: "Macroeconomics",
        subtopic: "Sovereign Pension Solvency",
        note: "Falling fertility shifts old-age dependency ratios, transforming labor supply and sovereign capital markets.",
        type: "physical",
      },
    ],
  };

  const curatedTree = domainTree[conceptSlug] ?? [];

  return (
    <section id="layer-connections" className="scroll-mt-20 space-y-4 pt-8 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
        <GitFork className="w-4 h-4" />
        <span>Level 6 · Where It Connects</span>
      </div>

      <div className="space-y-4">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans">
          This concept forms structural bridges across multiple domains of knowledge:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {curatedTree.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0f1520] space-y-2 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {item.domain}
                </span>
                <span
                  className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ${
                    item.type === "isomorphism"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                      : "bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
                  }`}
                >
                  {item.type === "isomorphism" ? "Mathematical Isomorphism" : "Direct Physical System"}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-serif">
                {item.subtopic}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
