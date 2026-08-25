# Mind of Aravalli — Product Specification & Philosophy

**Version:** 1.0 (Phase 5 Complete)  
**Status:** Feature Complete / Living Knowledge Engine  
**Project Type:** Personal Digital Encyclopedia & Intellectual Laboratory  

---

## 1. What Mind of Aravalli Is

**Mind of Aravalli** is a living personal digital encyclopedia designed to turn scattered information into structured, connected, durable understanding.

It is NOT:
* An AI note-taking app that dumps unedited summaries into a giant list.
* A bookmark manager or read-it-later folder where links gather dust.
* A generic CMS or social feed.
* A chatbot that answers ephemeral questions without building a structured body of knowledge.

The core promise is:
> *"The ideas you discover today should become durable understanding rather than disappear three days later."*

---

## 2. The Living Knowledge Workflow

```text
DISCOVER (URL, Paper, Lecture, Note)
   ↓
CAPTURE (/add)
   ↓
INBOX BUFFER (Uncommitted Research Staging)
   ↓
LOCAL / AI EXTRACTION (Candidate Proposals)
   ↓
HUMAN-IN-THE-LOOP AUDIT (Accept / Edit / Reject)
   ↓
INTEGRATION & ENRICHMENT (Concept + Provenance + Lattice)
   ↓
MASTER ENCYCLOPEDIA (5 Master Volumes)
```

---

## 3. The Knowledge Hierarchy

1. **Master Library & 5 Master Volumes**:
   - `Volume 01 — Universe & Physics`
   - `Volume 02 — Energy & Technology`
   - `Volume 03 — Biology & Life`
   - `Volume 04 — Complex Systems & Human Body`
   - `Volume 05 — Society, Money & Mind`
2. **Concept Nodes (The Atomic Unit of Knowledge)**:
   - Concepts are not database rows; they are miniature textbook chapters.
   - Organized along a 5-tier difficulty progression: `FOUNDATION` $\to$ `CORE` $\to$ `INTERMEDIATE` $\to$ `ADVANCED` $\to$ `FRONTIER`.
3. **The 6-Layer Explanation Architecture**:
   - **Level 1 — The Core Idea**: Plain-language definition answering *"What is this?"* in 1–3 sentences.
   - **Significance & Why It Matters**: Concrete practical importance.
   - **Level 2 — Build Intuition**: Thought experiments, everyday analogies, and their physical limitations.
   - **Level 3 — Mechanism & How It Works**: Step-by-step physical and causal mechanics.
   - **Level 4 — From First Principles**: Foundational invariants, conservation laws, symmetries, and mathematical assumptions.
   - **Level 5 — The Mathematics**: KaTeX equations with explicit variable definitions and physical interpretations.
   - **Level 6 — Where It Connects**: Cross-domain bridges strictly distinguishing mathematical isomorphisms from physical equivalence.
   - **Limitations & Misconceptions**: Disambiguating what the idea does *not* mean.
4. **The Knowledge Lattice (Connections)**:
   - First-class relationships between concepts (`STRUCTURAL_ANALOGY`, `DIRECT_PHYSICAL_CONNECTION`, `MATHEMATICAL_CONNECTION`, `CAUSAL_CONNECTION`, `SHARED_PRINCIPLE`, `APPLICATION`).
5. **Curiosity Radar (Questions)**:
   - Unresolved inquiries (`OPEN`, `EXPLORING`, `ANSWERED`) serving as navigational doorways into the concept graph.
6. **Sources & Provenance Catalog**:
   - Primary textbooks, academic papers, and seminal lectures grounding every concept. No fabricated sources.

---

## 4. Human-in-the-Loop Review Boundary

* AI or automated extraction processes **never** write directly to permanent encyclopedia chapters.
* All incoming material lands in the **Inbox Staging Area** (`/inbox`).
* Proposals identify matching concepts, candidate insights, proposed connections, and questions.
* The human curator reviews, modifies, and explicitly confirms knowledge promotion.

---

## 5. Global Search & Reading Exploration

* **Global Search (`Ctrl+K`)**: Instant search categorized across Concepts, Chapters, Connections, Questions, and Sources.
* **Reading Tracker & Bookmarks**: Local reading state preserved in `localStorage`, resuming recent reading sessions directly on the dashboard.
