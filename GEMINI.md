# Mind of Aravalli — Project Instructions & Guidelines

## 1. Scope, Boundary & Strict Repository Isolation Invariant
- **Workspace Root**: `c:\Users\visha\OneDrive\Documents\mind of aravalli`
- **Dedicated GitHub Repository**: `https://github.com/vs00918/aravalli`
- **Isolation Invariant**: *Mind of Aravalli* is a strictly independent, standalone project. 
  - **NEVER** read from, write to, or reference any external project directories outside `c:\Users\visha\OneDrive\Documents\mind of aravalli`.
  - **NEVER** mix, reuse, or reference git remotes, repositories, access tokens, API credentials, or configuration files belonging to any other project.
  - All operations, commits, branch management, and deployments are strictly confined to `vs00918/aravalli`.

---

## 2. Project Architecture & Installed Skills
This workspace is an intellectual laboratory dedicated to knowledge optimization, deep learning, curiosity, cross-disciplinary synthesis, philosophy, psychology, and mind expansion.

The following specialized skills are installed in `.agents/skills/`:

| Skill | Path | Focus Area |
| :--- | :--- | :--- |
| **`podcast-and-video-distiller`** | [SKILL.md](file:///c:/Users/visha/OneDrive/Documents/mind%20of%20aravalli/.agents/skills/podcast-and-video-distiller/SKILL.md) | Ingests long-form YouTube podcasts/lectures into first-principles Knowledge Tree nodes with expert auditing, gap-fulfillment, deduplication, and lived experience distillation. |
| **`knowledge-synthesis`** | [SKILL.md](file:///c:/Users/visha/OneDrive/Documents/mind%20of%20aravalli/.agents/skills/knowledge-synthesis/SKILL.md) | Progressive summarization (L1–L4), Feynman technique, Zettelkasten atomic notes, active recall, and scientific note optimization. |
| **`cross-domain-connector`** | [SKILL.md](file:///c:/Users/visha/OneDrive/Documents/mind%20of%20aravalli/.agents/skills/cross-domain-connector/SKILL.md) | Structural isomorphisms, interdisciplinary bridges (e.g. Physics $\leftrightarrow$ Economics $\leftrightarrow$ Biology $\leftrightarrow$ Philosophy), lateral transfers, and combinatory mental models. |
| **`visual-learning-architect`** | [SKILL.md](file:///c:/Users/visha/OneDrive/Documents/mind%20of%20aravalli/.agents/skills/visual-learning-architect/SKILL.md) | Visual schemas, Mermaid.js mind maps, flowcharts, concept graphs, state transitions, and causal loops. |
| **`book-distiller-and-analyzer`** | [SKILL.md](file:///c:/Users/visha/OneDrive/Documents/mind%20of%20aravalli/.agents/skills/book-distiller-and-analyzer/SKILL.md) | Adlerian analytical & syntopical reading, thesis deconstruction, argument logic chains, and actionable life/thought heuristics. |
| **`cognitive-philosophy-and-mind`** | [SKILL.md](file:///c:/Users/visha/OneDrive/Documents/mind%20of%20aravalli/.agents/skills/cognitive-philosophy-and-mind/SKILL.md) | Philosophy (Epistemology, Philosophy of Mind), Cognitive Psychology, Metacognitive auditing, mental model lattices (Munger), and human intelligence amplification. |

---

## 3. Knowledge Directory Structure Standard
When creating notes, research documents, or summaries, use the following layout:

```
mind of aravalli/
├── .agents/skills/           # Agent skill definitions
├── knowledge-tree/           # Master Knowledge Tree
│   ├── domains/              # 5 Consolidated Master Domain Treatises
│   └── INDEX.md              # Master Knowledge Tree index & graph
├── data/
│   └── knowledge-registry.json # Compiled Domain Registry
├── scripts/
│   └── build-tree.js         # Automated compiler
├── notes/
│   ├── atomic/               # Single-concept evergreen notes
│   └── subjects/             # Subject-specific deep notes
├── books/                    # Book deconstructions and summaries
├── models/                   # Cross-domain mental models and isomorphisms
├── philosophy-and-mind/      # Epistemology, psychology, and metacognition studies
├── visual-maps/              # Flowcharts, mind maps, and concept diagrams
├── index.html                # Live Web Portal SPA
├── README.md                 # Project Overview
└── GEMINI.md                 # Master workspace index & isolation rules
```
