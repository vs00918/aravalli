import React from "react";
import Link from "next/link";
import {
  Compass,
  Atom,
  Zap,
  Dna,
  Network,
  Scale,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function LibraryPreview() {
  const chapters = [
    {
      slug: "universe-physics",
      title: "Universe & Physics",
      description:
        "The fundamental laws of space, matter, time, quantum fields, and the conservation of information.",
      icon: Atom,
      accent: "text-sky-500 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
      conceptsCount: "12 foundational concepts",
      keyTopics: ["Atoms", "Spacetime", "Entropy", "Quantum Unitarity"],
    },
    {
      slug: "energy-technology",
      title: "Energy & Technology",
      description:
        "Electrochemical thermodynamics, battery storage quadrilemmas, and the industrial super-cycles.",
      icon: Zap,
      accent: "text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      conceptsCount: "9 foundational concepts",
      keyTopics: ["Electrochemistry", "LFP / Na-ion", "Thermal Runaway", "V2G Buffers"],
    },
    {
      slug: "biology-life",
      title: "Biology & Life",
      description:
        "Thermodynamics of living order (negentropy), molecular software, and super-Mendelian gene drives.",
      icon: Dna,
      accent: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      conceptsCount: "11 foundational concepts",
      keyTopics: ["Negentropy", "DNA as Software", "CRISPR", "Land Sparing"],
    },
    {
      slug: "complex-systems",
      title: "Complex Systems & Human Body",
      description:
        "How microscopic local rules produce macroscopic intelligence, allometric scaling, and the holobiont microbiome.",
      icon: Network,
      accent: "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
      conceptsCount: "10 foundational concepts",
      keyTopics: ["Emergence", "Square-Cube Law", "Swarm Stigmergy", "Gut-Brain Axis"],
    },
    {
      slug: "society-money-mind",
      title: "Society, Money & Mind",
      description:
        "Demographic transition invariants, Bayesian signal detection, and unconditional macroeconomic floors.",
      icon: Scale,
      accent: "text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      conceptsCount: "8 foundational concepts",
      keyTopics: ["Peak Humanity", "Base Rate Fallacy", "UBI", "Welfare Cliffs"],
    },
  ];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300 font-mono">
            Master Library
          </h2>
        </div>
        <Link
          href="/library"
          className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>View all volumes</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map((chapter) => {
          const Icon = chapter.icon;
          return (
            <Card
              key={chapter.slug}
              hoverable
              className="flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${chapter.accent}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {chapter.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        {chapter.conceptsCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {chapter.description}
                </p>

                {/* Key Topic Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {chapter.keyTopics.map((topic, i) => (
                    <Badge key={i} variant="subtle">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Exploration Affordance */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium">
                <span>Explore chapter</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
