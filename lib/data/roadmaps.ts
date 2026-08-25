export interface RoadmapItem {
  order: number;
  title: string;
  tier: "FOUNDATION" | "CORE" | "INTERMEDIATE" | "ADVANCED" | "FRONTIER";
}

export const CHAPTER_ROADMAPS: Record<string, RoadmapItem[]> = {
  "universe-physics": [
    { order: 1, title: "Matter & Mass", tier: "FOUNDATION" },
    { order: 2, title: "Motion & Velocity", tier: "FOUNDATION" },
    { order: 3, title: "Forces & Newton's Laws", tier: "FOUNDATION" },
    { order: 4, title: "Energy & Conservation Laws", tier: "CORE" },
    { order: 5, title: "Atoms & The Subatomic Scale", tier: "CORE" },
    { order: 6, title: "Fields & Electromagnetism", tier: "CORE" },
    { order: 7, title: "Thermodynamics & Heat", tier: "INTERMEDIATE" },
    { order: 8, title: "Entropy & Statistical States", tier: "INTERMEDIATE" },
    { order: 9, title: "Quantum Mechanics & Wavefunctions", tier: "ADVANCED" },
    { order: 10, title: "Special & General Relativity", tier: "ADVANCED" },
    { order: 11, title: "Information Conservation & Unitarity", tier: "FRONTIER" },
    { order: 12, title: "Quantum Field Theory & Spacetime", tier: "FRONTIER" },
  ],
  "energy-technology": [
    { order: 1, title: "What Is Energy?", tier: "FOUNDATION" },
    { order: 2, title: "Work, Power & Efficiency", tier: "FOUNDATION" },
    { order: 3, title: "Electricity & Charge Flow", tier: "CORE" },
    { order: 4, title: "Circuits & Resistance", tier: "CORE" },
    { order: 5, title: "Energy Generation & Conversion", tier: "INTERMEDIATE" },
    { order: 6, title: "Energy Density & Storage Limits", tier: "INTERMEDIATE" },
    { order: 7, title: "Batteries & Electrochemical Cells", tier: "ADVANCED" },
    { order: 8, title: "Power Grids & Transmission Buffers", tier: "ADVANCED" },
    { order: 9, title: "Computing Energetics & Super-Cycles", tier: "FRONTIER" },
    { order: 10, title: "Next-Generation Energy Systems", tier: "FRONTIER" },
  ],
  "biology-life": [
    { order: 1, title: "The Cell as the Unit of Life", tier: "FOUNDATION" },
    { order: 2, title: "Biomolecules & Chemistry of Life", tier: "FOUNDATION" },
    { order: 3, title: "Cellular Metabolism & Energy", tier: "CORE" },
    { order: 4, title: "How Life Maintains Order", tier: "CORE" },
    { order: 5, title: "DNA & The Genetic Code", tier: "CORE" },
    { order: 6, title: "Gene Expression & Protein Folding", tier: "INTERMEDIATE" },
    { order: 7, title: "Evolution by Natural Selection", tier: "INTERMEDIATE" },
    { order: 8, title: "Multicellular Organisms & Physiology", tier: "ADVANCED" },
    { order: 9, title: "Ecosystems & Trophic Energy Flows", tier: "ADVANCED" },
    { order: 10, title: "Synthetic Biology & Genetic Engineering", tier: "FRONTIER" },
  ],
  "complex-systems": [
    { order: 1, title: "Parts & System Interactions", tier: "FOUNDATION" },
    { order: 2, title: "Feedback Loops & Cybernetics", tier: "FOUNDATION" },
    { order: 3, title: "Networks & Graph Topology", tier: "CORE" },
    { order: 4, title: "Non-Linearity & Scaling Laws", tier: "CORE" },
    { order: 5, title: "Emergence & Self-Organization", tier: "INTERMEDIATE" },
    { order: 6, title: "Homeostasis & Internal Regulation", tier: "INTERMEDIATE" },
    { order: 7, title: "Collective & Swarm Intelligence", tier: "ADVANCED" },
    { order: 8, title: "The Human Holobiont & Microbiome", tier: "ADVANCED" },
    { order: 9, title: "Systemic Fragility & Resilience", tier: "FRONTIER" },
  ],
  "society-money-mind": [
    { order: 1, title: "Individuals & Basic Needs", tier: "FOUNDATION" },
    { order: 2, title: "Incentives & Human Behavior", tier: "FOUNDATION" },
    { order: 3, title: "Cooperation & Game Theory", tier: "CORE" },
    { order: 4, title: "Division of Labor & Trade", tier: "CORE" },
    { order: 5, title: "Money & Mediums of Exchange", tier: "CORE" },
    { order: 6, title: "Markets & Price Discovery", tier: "INTERMEDIATE" },
    { order: 7, title: "Institutions & Legal Frameworks", tier: "INTERMEDIATE" },
    { order: 8, title: "Information Asymmetry & Signaling", tier: "ADVANCED" },
    { order: 9, title: "Demographic Transition & Momentum", tier: "ADVANCED" },
    { order: 10, title: "Social Safety Nets & Welfare Floors", tier: "FRONTIER" },
  ],
};
