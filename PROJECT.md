# Mind of Aravalli — Project Master & Handoff Specification

**Repository**: `https://github.com/vs00918/aravalli`  
**Workspace Root**: `c:\Users\visha\OneDrive\Documents\mind of aravalli`  
**Architecture Status**: 🟢 **FROZEN / PRODUCTION**  
**Core Directive**: *Build once, apply forever. Routine operations require zero code modifications.*

> [!IMPORTANT]
> **Live State Invariant**: Never trust `PROJECT.md`'s numerical snapshot over the live repository. Before acting, always inspect the repository (`data/banking-ca-registry.json`, `git status`, test runners) and derive the true current counts and state.

---

## 1. Project Identity & Purpose

*Mind of Aravalli* is a specialized, standalone knowledge engineering system and exam intelligence platform tailored for Indian Banking Officer-Level Mains examinations:
* **Target Examinations**: **SBI PO Mains** & **IBPS PO Mains** (Officer-level regulatory and banking focus; no clerk-level trivialities).
* **Active Rolling Window**: Rolling 6-month window prior to mains examinations.
* **Core Philosophy**: **Optimize exam utility per minute of study, NOT the volume of notes produced.**

The system ingests multi-source current affairs (CGB Mentors, Smartkeeda, PIB, Official Gazettes), canonicalizes them into deduplicated, exam-weighted educational topics, indexes them for full-text search and active recall drills, and renders them through an intelligent, content-aware continuous reader.

---

## 2. Current Production State (Snapshot Reference Only)

*The figures below represent the repository snapshot at the time of writing. Always inspect live repository files for actual runtime counts.*

* **Active Canonical Corpus (Snapshot)**: **615 Canonical Topics**
  * **P1 — Critical / Deep**: 55 Topics (413 Min Total Study Load)
  * **P2 — High-Yield**: 253 Topics
  * **P3 — Rapid-Scan / Factoids**: 307 Topics
* **Indexed Months (Snapshot)**: 8 Months (`2026-01`, `2026-02`, `2026-03`, `2026-04`, `2026-05`, `2026-06`, `2026-07`, `2026-08`)
* **Latest Ingested Batches (Snapshot)**: 
  * `12-june-2026-cgb.md` (June 2026 Consolidated — 17 New Canonical Topics, 34 Factoids)
  * `11-july-2026-cgb.md` (July 2026 Consolidated — 17 New Canonical Topics, 32 Factoids)
  * `10-august-2026-smartkeeda-w3.md` (August 2026 Week 3)
* **Test Suite Status (Snapshot)**: 🟢 **38 / 38 QA Tests Passed · 100% Presentation & Pipeline Tests Passed**
* **Production Build Status (Snapshot)**: 🟢 **639 / 639 Static HTML Pages Prerendered Cleanly** (`next build`)

---

## 3. Source of Truth

The repository files on disk are the **sole authoritative source of truth**. Conversation history and chat transcripts are ephemeral and must never be treated as the project state.

| Directory / File | Authority & Role |
| :--- | :--- |
| `knowledge-tree/banking-ca/*.md` | **Master Canonical Notes**. Human-readable and AST-parsable markdown containing all canonical knowledge blocks. |
| `data/banking-ca-registry.json` | **Compiled Master Database**. Complete topic store, chronological indexes, and category groupings queried by the Next.js frontend. |
| `data/ingestion-provenance.json` | **Provenance Audit Registry**. Records every ingested batch, publisher, date range, topic count, and hash verification. |
| `data/verification-registry.json` | **Layer-B Verification Registry**. Persistent storage for officially verified primary documents, SHA-256 hashes, and verified claim anchors. |
| `data/review-queue.json` | **Exception Review Queue**. Unresolved factual contradictions or identity ambiguities awaiting human review. |
| `lib/banking-ca/pipeline/` | **Frozen Ingestion Engine**. Zero-configuration pipeline modules (PDF extractor, entity resolver, canonicalizer, trust assigner). |

---

## 4. System Architecture & Ingestion Flow

The production pipeline processes all incoming current-affairs feeds uniformly through a 7-stage deterministic flow:

```
                      INCOMING PDF / SOURCE FEED
                                  │
                                  ▼
                        [1. PDF INGESTION]
               (pdf-parse / text stream in-memory)
                                  │
                                  ▼
                   [2. CLAIM & EVENT EXTRACTION]
             (AST parsing into RawIncomingFeedItem[])
                                  │
                                  ▼
                   [3. CANONICAL ENTITY RESOLUTION]
          (Fuzzy match, temporal proximity, alias checking)
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
   [EXISTING ENTITY]                              [NEW CANONICAL ENTITY]
   • Exact duplicate? → Discard                   • Standardize slug & title
   • Complementary fact? → Enrich                 • First-principles breakdown
   • Value conflict? → Enqueue Review             • Assign exam-weighted category
          │                                               │
          └───────────────────────┬───────────────────────┘
                                  │
                                  ▼
                     [4. TRUST STATE ASSIGNMENT]
          • Layer-A: COACHING_SOURCE_GROUNDED
          • Reusable Layer-B: Reuse verified artifact if matched
                                  │
                                  ▼
                     [5. CANONICAL CORPUS MERGE]
               (knowledge-tree/*.md & registry update)
                                  │
                                  ▼
                 [6. COMPILATION & STATIC GENERATION]
             (npm run compile:banking-ca → next build)
                                  │
                                  ▼
                    [7. DELIVERY TO STUDY PRODUCT]
           • Continuous Reader (Dynamic 5 Primitives)
           • Topic Detail Deep Reader
           • Full-Text Search Engine (Fuse.js)
           • Active Recall Revision Hub (Spaced Repetition)
```

### Two-Layer Trust Architecture
* **Layer-A (Source Grounding)**: Confirms that an item faithfully represents its coaching source (CGB Mentors, Smartkeeda, PIB). Assigned `COACHING_SOURCE_GROUNDED` or `CROSS_SOURCE_CONFIRMED`.
* **Layer-B (Official Verification)**: Independent statutory verification against official primary gazettes/circulars (RBI, SEBI, PIB, MCA). Requires SHA-256 hashed document artifacts, exact byte locators, and value matching. Assigned `OFFICIALLY_VERIFIED`.
* **Trust Invariant**: **Coaching-source agreement (Layer-A) must NEVER be promoted to official verification (Layer-B).** Successful ingestion proves coaching grounding, not official statutory truth.

---

## 5. Future PDF Ingestion Contract

The universal production entry point for all current affairs ingestion is:
```bash
npm run ingest -- "<path-to-pdf>"
```

### Ingestion Contract Requirements:
* **No PDF-Specific Code**: The parser handles unseen PDFs generically via `lib/banking-ca/pipeline/pdf-extractor.ts`.
* **No Manually Authored Slugs/Maps**: Entity resolution and slug generation are completely automated.
* **No Synthetic Records**: Never invent or backfill artificial verification records.
* **In-Memory Hygiene**: Raw PDFs are processed in RAM buffer; no binary PDFs or temporary files enter Git.
* **Automated Workflow**:
  1. Extract structured text from binary PDF buffer.
  2. Map items into canonical topics (resolve existing vs new).
  3. Deduplicate exact copies; merge complementary facts.
  4. Enqueue genuine contradictions to `data/review-queue.json`.
  5. Update canonical markdown and `data/banking-ca-registry.json`.
  6. Rebuild and validate regression suite.

---

## 6. Trust-State Reference Matrix

| Trust State | Meaning & Verification Criteria |
| :--- | :--- |
| `OFFICIALLY_VERIFIED` | **Layer-B Verified**. Backed by an official primary document in `artifacts/verified/`, matching SHA-256 hash, and exact byte locator. |
| `CROSS_SOURCE_CONFIRMED` | **Layer-A Grounded**. Verified as present across 2 or more independent coaching sources (e.g. CGB + Smartkeeda) with matching facts. |
| `COACHING_SOURCE_GROUNDED` | **Layer-A Grounded**. Faithfully extracted from 1 coaching source (CGB Mentors or Smartkeeda) with full provenance. |
| `EXTERNAL_VERIFICATION_PENDING` | Mapped to an official authority target, but official primary document is yet to be retrieved. |
| `CONFLICT_DETECTED` | Conflicting facts/numbers detected between sources; enqueued to `data/review-queue.json`. |

---

## 7. Canonical Data Protection Rules

When processing new batches, the agent must strictly preserve data integrity:
1. **Never Alter Established Facts**: Do not overwrite existing verified numbers or definitions with vague summaries.
2. **Never Inflate Priorities**: P1 is reserved for major RBI/monetary reforms, deep statutory frameworks, and high-impact schemes. Do not upgrade P3/P4 items to P1 to pad statistics.
3. **Never Silently Resolve Conflicts**: If Source A says 6.25% and Source B says 5.25%, keep the grounded note and route the conflict to `data/review-queue.json`.
4. **Preserve Complete Provenance**: Always update `data/ingestion-provenance.json` with batch metadata.
5. **Anti-Loss Merging**: When merging duplicate items, retain the union of all complementary facts from both sources.

---

## 8. Content Presentation Architecture

The continuous briefing reader (`/briefing/[month]`) dynamically determines topic presentation at runtime using `classifyTopicPresentation(topic)` in `lib/banking-ca/presentation-classifier.ts`. **Zero manual per-topic layout mapping is permitted.**

### The 5 Visual Primitives:
1. **`DeepBrief`** (P1 Critical & Substantial P2, ~8–10 min): Full pedagogical hierarchy (*What Happened*, *Must Memorize Key Rules*, *Know/Understand Context*, *Exam Angles / MCQ Points*, time budget).
2. **`Brief`** (Standard Multi-Fact P2, ~3–5 min): Balanced structured layout for regulatory circulars and proposals with clear *Key Facts* and subtle status badges (`PROPOSAL`, `DRAFT`).
3. **`MetricCallout`** (Rate / Percentage / Outlay Dominant, ~2–3 min): Highlights numbers, currency values, and indices (`₹75,021 Cr`, `6.4%`, `384`) in a prominent high-contrast badge.
4. **`EventRow`** (Appointments, Awards, Sports, Summits, ~1–2 min): Compact key-value card with dynamic icon badges (`UserCheck`, `Award`, `Trophy`, `Handshake`) and dates.
5. **`FactStrip`** (P3/P4 One-Liners & Corporate Deals, ~30s–1 min): Ultra-compact text strip for rapid scanning without heavy card borders.

---

## 9. Testing & Quality Assurance Contract

After every batch ingestion or canonical update, execute the standard validation suite:

```bash
# 1. Compile master database from markdown sources
npm run compile:banking-ca

# 2. Run domain unit tests
npm run test:compiler       # Validates schema, parser, and category normalization
npm run test:pwa            # Validates PWA manifest, service worker, and offline shell
npm run test:search         # Validates Fuse.js search index consistency
npm run test:revision       # Validates spaced repetition and active recall engine
npm run test:pipeline       # Validates simulation scenarios and Layer-B verification
npm run test:smoke          # Validates frozen pipeline against incoming feeds
npm run test:pdf            # Validates in-memory binary PDF parsing
npm run test:presentation   # Validates dynamic 5-primitive presentation classifier

# 3. Run master post-deploy QA suite (38 Invariants)
npm run test:qa

# 4. Type check & Lint
npm run type-check
npm run lint

# 5. Production Static Compilation
npm run build
```

---

## 10. Operational Exception & Review Policy

The system operates autonomously. Human review is required **only** when:
* **Factual Contradiction**: An incoming feed reports numbers/dates directly conflicting with existing canonical records $\longrightarrow$ Enqueued to `data/review-queue.json`.
* **Identity Ambiguity**: The entity resolver cannot determine with $>75\%$ confidence whether a topic is new or existing.
* **Malformed Input**: Unparseable PDF format or corrupted text stream.
* **Critical Official Conflict**: An official Layer-B document disproves a coaching claim.

---

## 11. Conversation Handoff Protocol

When starting work in a **new conversation thread**:

```
1. READ PROJECT.md
   Understand the system identity, frozen architecture, and invariants.
   
2. INSPECT CURRENT REPOSITORY STATE
   Run git status and inspect data/banking-ca-registry.json to know the exact corpus count.
   
3. NEVER REBUILD OR AUDIT PREVIOUS WORK
   Do NOT restart W-series audits, trust redesigns, or schema migrations.
   
4. INGEST NEW BATCH VIA FROZEN PIPELINE
   Execute: npm run ingest -- "<path-to-pdf>"
   
5. VALIDATE & BUILD
   Run test:qa, type-check, and build to confirm zero regressions.
```

---

## 12. Strictly Forbidden Behaviors

* ❌ **Do NOT restart W-series audits** (W1–W11 are complete and archived).
* ❌ **Do NOT redesign the ingestion pipeline** merely because a PDF contains a new layout pattern.
* ❌ **Do NOT create synthetic or fake verification records**.
* ❌ **Do NOT author manual per-topic hardcoded maps** in ingestion scripts.
* ❌ **Do NOT modify canonical facts** merely to force a test to pass.
* ❌ **Do NOT store binary PDFs in the repository** or commit PDFs to Git.
* ❌ **Do NOT confuse passing tests with official statutory truth**.
* ❌ **Do NOT silently discard source content**.

---

## 13. Current Known Limitations

1. **Layer-A vs Layer-B Coverage**: While 100% of canonical topics are grounded in coaching sources (Layer-A), only a curated pilot set is officially verified against primary gazettes (Layer-B). Coaching corroboration is strong but not identical to primary statutory proof.
2. **Dynamic Government Numbers**: Economic metrics (GDP estimates, CPI inflation, forex reserves) are point-in-time and subject to periodic statistical revisions. Change-sensitive facts carry warning tags.

---

## 14. Quick-Start Action Checklist for New Agent

- [ ] Read `PROJECT.md`.
- [ ] Inspect live repository state (`data/banking-ca-registry.json`, `git status`).
- [ ] Receive new PDF path from user.
- [ ] Run `npm run ingest -- "<path-to-pdf>"`.
- [ ] Inspect ingestion CLI summary report.
- [ ] Check `data/review-queue.json` (act only if new exceptions were enqueued).
- [ ] Run `npm run test:qa && npm run build`.
- [ ] Present concise batch report (P1 / P2 / P3 / P4 / Filtered).
