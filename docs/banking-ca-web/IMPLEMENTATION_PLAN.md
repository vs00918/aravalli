# Banking Current Affairs Web Application — Implementation Plan (Phase W1 to W8)

> **Document Version**: 1.0.0  
> **Status**: Implementation Roadmap Baseline  
> **Phase Execution Rule**: Execute strictly phase-by-phase. Phase W1 is Architecture Only (No UI/scaffolding code).

---

## 1. Phase Roadmap Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W1: System Architecture & Data Contract Specification [COMPLETED]    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W2: Ingestion Compiler & Registry Validator (Scripts & Schemas)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W3: App Shell, Dashboard Command Center & Theme Foundation           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W4: Canonical Knowledge Browser & Progressive Disclosure Views       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W5: Time-Budgeted Revision Engine & Change-Sensitive Tracker         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W6: High-Performance Search & Institution Intelligence Hub           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W7: Offline PWA, Cross-Device Local State & Bookmarking              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Phase W8: Quality Assurance, Automated CI/CD & Deployment Pipeline         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase-by-Phase Detailed Specifications

### Phase W1: Architecture & Data Contract (CURRENT PHASE)
* **Objective**: Define immutable architectural principles, TypeScript interfaces, routing structure, and deployment model.
* **Deliverables**:
  - `docs/banking-ca-web/ARCHITECTURE.md`
  - `docs/banking-ca-web/DATA_MODEL.md`
  - `docs/banking-ca-web/ROUTES.md`
  - `docs/banking-ca-web/IMPLEMENTATION_PLAN.md`
* **Acceptance Criteria**: All architecture documents written, internally consistent, adhering to zero-token-leak, separation of content from presentation, and single-canonical-topic invariants.
* **Exit Condition**: **STOP. Do NOT scaffold code or build UI components in Phase W1.**

---

### Phase W2: Ingestion Compiler & Registry Validator
* **Objective**: Build a robust, automated compiler script in Node.js/TypeScript that parses markdown files from `knowledge-tree/banking-ca/*.md` and generates the validated, indexed `data/banking-ca-registry.json`.
* **Expected Files**:
  - `scripts/compile-banking-ca.ts` (Markdown AST parser & index builder)
  - `lib/banking-ca/schema.ts` (Zod validation schemas matching `DATA_MODEL.md`)
  - `lib/banking-ca/types.ts` (Core TypeScript interfaces)
  - `data/banking-ca-registry.json` (Normalized canonical dataset)
* **Dependencies**: `zod`, `gray-matter`, `unified`, `remark-parse`.
* **Acceptance Criteria**: Running `npm run compile-ca` parses all canonical files, validates 100% of fields with zero errors, and outputs the indexed JSON.

---

### Phase W3: App Shell, Dashboard Command Center & Theme Foundation
* **Objective**: Build the responsive application layout, modern editorial theme (clean warm cream/paper typography with dark slate accents), navigation sidebar, and high-level Dashboard.
* **Expected Files**:
  - `app/layout.tsx` (Global fonts, theme provider, metadata)
  - `app/page.tsx` & `app/dashboard/page.tsx` (Today's Revision Dial, Active P1 carousel)
  - `components/layout/AppNavbar.tsx`, `components/layout/SidebarNav.tsx`
  - `components/dashboard/TodaysRevisionCard.tsx`, `components/dashboard/ActiveP1Carousel.tsx`
* **Acceptance Criteria**: Fast, responsive layout on mobile/desktop with accessible contrast and instant dashboard load.

---

### Phase W4: Canonical Knowledge Browser & Topic Views
* **Objective**: Build the canonical topic reader with progressive disclosure (Must Memorize $\to$ Context $\to$ Timeline $\to$ Sources).
* **Expected Files**:
  - `app/topics/page.tsx` (Filterable directory of all canonical topics)
  - `app/topics/[slug]/page.tsx` (Static page generation via `generateStaticParams`)
  - `components/topic/MustMemorizeDeck.tsx`, `components/topic/RegulatoryStatusBadge.tsx`
  - `components/topic/VerificationBadge.tsx`, `components/topic/SourceProvenanceSection.tsx`
* **Acceptance Criteria**: Single-topic URLs render cleanly with KaTeX math support and clear visual hierarchy for `P1`, `P2`, and `P3`.

---

### Phase W5: Time-Budgeted Revision Engine
* **Objective**: Implement the dynamic study engine allowing students to launch 15-min, 30-min, or 60-min targeted revision decks.
* **Expected Files**:
  - `app/revision/page.tsx` (Revision Hub)
  - `app/revision/deck/page.tsx` (Interactive session runner)
  - `app/revision/changes/page.tsx` (Change-sensitive alerts table)
  - `components/revision/RevisionTimer.tsx`, `components/revision/RevisionFlashcard.tsx`
* **Acceptance Criteria**: Selecting "60-Min Revision" dynamically loads the 7 active P1 topics (~51 min) + top change-sensitive P2 item with persistent local completion state.

---

### Phase W6: High-Performance Search & Institution Hub
* **Objective**: Implement instant full-text search across topics, institutions, numbers, and categories with zero server latency.
* **Expected Files**:
  - `app/search/page.tsx` & `components/search/GlobalSearchModal.tsx` (`Cmd+K` trigger)
  - `lib/search/search-index.ts` (Client-side search engine using in-memory FlexSearch)
  - `app/institutions/page.tsx` & `app/institutions/[institutionId]/page.tsx`
* **Acceptance Criteria**: Search queries for "1.93%", "Tata Sons", or "MCLR" return relevant canonical topics in $<30\text{ms}$.

---

### Phase W7: Offline PWA, Cross-Device Local State & Bookmarking
* **Objective**: Add Service Worker caching, offline manifest, and `IndexedDB` local state management for offline study in libraries.
* **Expected Files**:
  - `public/manifest.json`, `public/sw.js` (or `next-pwa` configuration)
  - `lib/storage/user-progress.ts` (Bookmarks, completed revisions, custom notes in IndexedDB)
* **Acceptance Criteria**: Web app functions seamlessly with internet disconnected after initial load.

---

### Phase W8: Quality Assurance, Automated CI/CD & Deployment
* **Objective**: Automate production builds on Git push and deploy to global CDN edge hosting.
* **Expected Files**:
  - `.github/workflows/deploy.yml` (GitHub Actions build & test pipeline)
  - `scripts/verify-data-integrity.ts` (Pre-build schema and broken link validator)
* **Acceptance Criteria**: Every commit to `main` automatically validates canonical data, compiles the registry, runs type checks, and deploys live in $<2$ minutes.
