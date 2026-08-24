# Mind of Aravalli 🌳

> An interconnected, first-principles Personal Knowledge System (PKM) and epistemic laboratory. Knowledge grows systematically from **Roots** (irreducible axioms) through the **Trunk** (universal mental models) into **Branches** (specialized domains) and **Leaves** (lived experiences, long-form podcast crucibles, and case studies).

---

```mermaid
graph TD
    RootNode["🌳 Aravalli Knowledge Tree"] --> Roots["🌱 Roots: First Principles & Axioms"]
    RootNode --> Trunk["🪵 Trunk: Core Systems & Mental Models"]
    RootNode --> Branches["🌿 Branches: Domains & Taxonomies"]
    RootNode --> Leaves["🍃 Leaves: Lived Experiences & Media Distillations"]

    %% Roots
    Roots --> R1["Electrochemical Energy Storage Axioms"]
    Roots --> R2["Thermodynamics, Entropy & Schrödinger's Negentropy"]
    Roots --> R3["Atomic Hypothesis & Quantum Fields Scale"]

    %% Trunk
    Trunk --> T1["Battery Quadrilemma & Thermal Runaway Dynamics"]
    Trunk --> T2["Three Super Cycles: Energy, Mfg & AI"]
    Trunk --> T3["Emergence, Reductionism & Informational Biology"]
    Trunk --> T4["Degenerate Matter & Extreme Cosmic Density"]

    %% Branches
    Branches --> B1["Comparative Chemistries: LFP, Sodium, Ni-H2, Solid-State"]
    Branches --> B2["Epistemology of Life & Artificial Silicon Life"]
    Branches --> B3["Standard Model & Fundamental Particle Taxonomy"]

    %% Leaves
    Leaves --> L1["WTF are Batteries? — EnerVenue x HiNa with Nikhil Kamath"]
    Leaves --> L2["What Is Life? Is Death Real? — Kurzgesagt & Schrödinger"]
    Leaves --> L3["How Small Is An Atom? — Kurzgesagt & Feynman"]

    %% Cross-Tier Connections
    R1 --> T1
    R2 --> T3
    R3 --> T4
    T1 --> B1
    T3 --> B2
    T4 --> B3
    B1 --> L1
    B2 --> L2
    B3 --> L3
    T2 --> L1
```

---

## 📚 The Knowledge Tree Structure

### 1. 🌱 Roots (Axioms & Physical Invariants)
* [**Electrochemical Energy Storage Axioms**](./knowledge-tree/roots/electrochemical-energy-storage-axioms.md) — Fundamental physics of charge separation, potential wells, Faraday/Nernst limits, and Gibbs free energy.
* [**Thermodynamics, Entropy & Schrödinger's Negentropy**](./knowledge-tree/roots/thermodynamics-entropy-and-schrodinger-negentropy.md) — Physical definition of life as open non-equilibrium thermodynamic systems resisting entropy ($\frac{dS_{\text{int}}}{dt} < 0$).
* [**The Atomic Hypothesis & Quantum Field Foundations**](./knowledge-tree/roots/atomic-hypothesis-quantum-fields-scale.md) — Feynman's atomic invariant, $10^5:1$ nuclear scale ratio, QED zero-point vacuum fluctuations, and probability density clouds.

### 2. 🪵 Trunk (Core Mental Models & Systems)
* [**The Battery Quadrilemma & Thermal Runaway Dynamics**](./knowledge-tree/trunk/battery-tradeoff-trilemma-and-thermal-runaway.md) — 4-way optimization trade-off space and positive-feedback exothermic chain reaction mechanics (14,000+ LFP fire baseline).
* [**The Three Converging Super-Cycles: Energy, Manufacturing & AI**](./knowledge-tree/trunk/three-super-cycles-energy-manufacturing-ai.md) — Electrification + Automated Manufacturing + Exponential AI Compute, 98% idle vehicle V2G buffers, and local-for-local supply chain sovereignty.
* [**Emergence, Reductionism & Informational Biology**](./knowledge-tree/trunk/emergence-reductionism-and-informational-biology.md) — The Reductionist Paradox: zero living molecules in a cell, life as an emergent catalytic orchestra, informational code (DNA as software), and the boundary spectrum.
* [**Degenerate Matter, Extreme Cosmic Density & Quantum Indistinguishability**](./knowledge-tree/trunk/degenerate-matter-and-extreme-cosmic-density.md) — Pauli Exclusion breakdown, degenerate electron/neutron pressures, the Teaspoon of Humanity Gedankenexperiment, and universal quantum indistinguishability.

### 3. 🌿 Branches (Disciplines & Chemistry/Physics Paradigms)
* [**Comparative Battery Chemistries Matrix**](./knowledge-tree/branches/energy-storage-chemistries-lfp-sodium-nickel-hydrogen.md) — Direct benchmark: LFP vs. Sodium-Ion ($\text{Na-ion}$) vs. Nickel-Hydrogen ($\text{Ni-H}_2$) vs. Solid-State (TRL 4).
* [**Epistemology of Life: Definitions & Artificial Silicon Life**](./knowledge-tree/branches/definition-of-life-and-artificial-life.md) — Astrobiology, NASA/Thermodynamic/Cybernetic operational definitions, substrate neutrality, and artificial silicon life.
* [**Standard Model of Particle Physics: The Taxonomy of Fundamental Matter**](./knowledge-tree/branches/standard-model-and-particle-physics-taxonomy.md) — Taxonomy of matter: Quarks, Leptons, Gauge Bosons (Gluons, Photons, W/Z), Higgs mechanism, and the 4 Fundamental Forces.

### 4. 🍃 Leaves (Podcasts, Essays & Empirical Crucibles)
* [**Podcast: WTF are Batteries?**](./knowledge-tree/leaves/podcast-enervenue-hina-nikhil-kamath-batteries.md) — EnerVenue (Henning Rath) x HiNa Battery (Dr. Kun Tang) hosted by Nikhil Kamath.
* [**Visual Essay: What Is Life? Is Death Real?**](./knowledge-tree/leaves/kurzgesagt-schrodinger-what-is-life-death.md) — Kurzgesagt & Schrödinger: negentropy, protein nanomachines, viruses, and the dissolution of the life/death binary.
* [**Visual Essay: How Small Is An Atom?**](./knowledge-tree/leaves/kurzgesagt-quantum-atomic-scale-feynman.md) — Kurzgesagt & Feynman: Spatial scale progression, the Empire State grain of rice, and Feynman's atomic legacy.

---

## 🛠️ Specialized Research & Synthesis Engines (`.agents/skills/`)
1. [`podcast-and-video-distiller`](./.agents/skills/podcast-and-video-distiller/SKILL.md): Long-form media ingestion into first-principles tree nodes with multi-persona expert auditing.
2. [`knowledge-synthesis`](./.agents/skills/knowledge-synthesis/SKILL.md): Progressive summarization (L1–L4), Feynman technique, Zettelkasten atomic notes.
3. [`cross-domain-connector`](./.agents/skills/cross-domain-connector/SKILL.md): Structural isomorphisms and lateral mental model transfers.
4. [`visual-learning-architect`](./.agents/skills/visual-learning-architect/SKILL.md): Visual Mermaid schemas, flowcharts, and causal loop models.
5. [`book-distiller-and-analyzer`](./.agents/skills/book-distiller-and-analyzer/SKILL.md): Mortimer Adler analytical and syntopical reading deconstruction.
6. [`cognitive-philosophy-and-mind`](./.agents/skills/cognitive-philosophy-and-mind/SKILL.md): Epistemology, cognitive psychology, and Charlie Munger mental model lattices.
