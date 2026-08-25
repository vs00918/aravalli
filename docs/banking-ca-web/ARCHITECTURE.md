# Banking Current Affairs Web Application — System Architecture Specification (Phase W1)

> **Document Version**: 1.0.0 (Phase W1 Architecture)  
> **Status**: Architecture Specification & Data Contract Baseline  
> **Scope**: Structural design, data flows, deployment model, security, and scalability for the CA Mentor Web Application.

---

## 1. System Mission & Core Philosophy

The Banking Current Affairs Web Application is a **Personal Current Affairs Study OS** designed for high-stakes Indian Banking Officer-Level Examinations (**SBI PO Mains, IBPS PO Mains, and Regulatory Officer exams**).

The application is NOT:
- A generic markdown documentation site (e.g. Docusaurus/GitBook clone).
- A flat news aggregator or chronological blog.
- An uncurated database dump.

### The Central User Invariant:
> **"What should I study right now with my available time, and where does this knowledge belong in the canonical picture?"**

---

## 2. Fundamental Architecture & Invariant Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            1. CA MENTOR AGENT                               │
│  (Ingests raw PDFs, filters noise, calibrates P1/P2/P3, audits fidelity)    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Writes Canonical Markdown
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      2. CANONICAL KNOWLEDGE REPOSITORY                      │
│      knowledge-tree/banking-ca/*.md (Single Source of Authoritative Truth)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Ingestion Compiler (Node.js / TS)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        3. STABLE DATA CONTRACT (JSON)                       │
│    data/banking-ca-registry.json (Type-safe, normalized, indexed payload)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Static Site Generation (SSG / Hybrid)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      4. WEB APPLICATION LAYER (Next.js)                     │
│  (Presentation, progressive disclosure, time-aware revision, instant search)│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Deployed via CI/CD
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     5. CROSS-DEVICE CLIENT / PWA CACHE                      │
│     (Desktop, Laptop, Tablet, Mobile · Offline-capable · Zero token leak)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architectural Invariant: Strict Separation of Content & Presentation
1. **The Canonical Knowledge Base is the Sole Source of Truth**: The web application never creates, mutates, or owns current affairs truth. If the web frontend is deleted or completely rewritten, the markdown files in `knowledge-tree/banking-ca/` remain 100% complete and usable.
2. **One Canonical Topic $\leftrightarrow$ Multiple Chronological Feeds**: An underlying economic or regulatory event is represented by exactly **one canonical knowledge item**, regardless of how many monthly PDFs mention or update it.

---

## 3. Scale & Performance Modeling (6 to 24 Months)

### Projected Data Scale:
| Dimension | 6-Month Active Window | 24-Month Full Archive | Architectural Strategy |
| :--- | :--- | :--- | :--- |
| **Canonical Topics** | ~250 – 400 Topics | ~1,000 – 1,500 Topics | Normalized JSON with shallow slug index |
| **P1 Active Items** | 6 – 8 Topics (~50 min) | 6 – 8 Active (Rolling) | Dynamic time-budget filtering |
| **Chronological Feeds** | ~24 Weekly / 6 Monthly | ~96 Weekly / 24 Monthly | Grouped by Year-Month in router |
| **Payload Size (JSON)** | ~400 KB uncompressed | ~1.8 MB uncompressed (gzipped ~250 KB) | Zero runtime DB needed; instant in-memory load |
| **Search Index Size** | ~150 KB index | ~600 KB index | In-memory FlexSearch on client worker |

### Performance Invariants:
- **Zero Database Requirement**: The application will run entirely as a **Statically Generated Application (SSG)**. No external PostgreSQL/MongoDB instance is required for content delivery, eliminating latency, connection pooling overhead, and maintenance costs.
- **Sub-100ms Page Navigation**: All static routes are pre-rendered at build time; topic switching on mobile is instantaneous.

---

## 4. Hosting & Deployment Model Evaluation

| Platform Option | Architectural Fit | Maintenance Cost | Build Integration | Verdict |
| :--- | :---: | :---: | :---: | :--- |
| **GitHub Pages** | High | $0 / month | Standard GH Actions | Viable, but lacks native Next.js image optimization and edge routing. |
| **Cloudflare Pages / Vercel** | **Optimal (Recommended)** | **$0 / month** | Instant Git Webhook on `origin/main` push | **Selected**: Automatic CI/CD build on every agent git commit, global CDN edge caching, built-in HTTPS, sub-second TTFB. |
| **Containerized Server (Docker/VPS)** | Poor | $5–$20 / month | High maintenance | **Rejected**: Violates zero-maintenance invariant. |

### Recommended Deployment Workflow:
1. Antigravity Agent ingests a batch $\to$ commits to `vs00918/aravalli` on GitHub.
2. GitHub Webhook triggers Vercel/Cloudflare Pages build.
3. Build step executes `node scripts/compile-banking-ca.js` $\to$ builds static HTML pages with zero server latency.

---

## 5. Security & Privacy Architecture

1. **Strict Zero-Token Invariant**:
   - **NEVER** expose Antigravity API keys, GitHub Fine-Grained Personal Access Tokens (PAT), or administrative credentials in client-side bundles, environment variables prefixed with `NEXT_PUBLIC_`, or client code.
   - The web app is a **read-only consumer** of pre-built public static data.
2. **User Data & Personal State Isolation**:
   - User bookmarks, revision checkmarks, custom revision plans, and recall test histories are stored strictly in browser **`localStorage` / `IndexedDB`**.
   - No sensitive personal study data is transmitted to third-party tracking services.

---

## 6. Cross-Device & Offline Architecture (PWA)

- **Target Scenarios**: Studying in libraries, metro commutes, and low-connectivity environments on mobile phones and tablets.
- **PWA Strategy**:
  - Service Worker caches core application shell (JS/CSS/fonts) and the canonical JSON dataset.
  - Once visited, recently reviewed topics and the active P1 revision deck remain fully accessible offline.
  - Manifest configured for "Add to Home Screen" standalone app experience on iOS and Android.

---

## 7. Progressive Disclosure & Information Density Principles

To prevent cognitive overload from dense banking regulations:
1. **Tier 1 (Surface / Glance)**: Title, Institution, Priority Badge (`P1`, `P2`, `P3`), Status Badge (`DRAFT`, `APPROVED`), and Revision Time Tag (`~5 min`).
2. **Tier 2 (Core Recall / 3-Minute Survival)**: **`MUST MEMORIZE`** bullet points (numbers, thresholds, dates, statutory sections).
3. **Tier 3 (Understanding)**: **`KNOW / UNDERSTAND`** conceptual mechanisms (why the policy exists, macroeconomic context).
4. **Tier 4 (Deep Context / Provenance)**: **`OPTIONAL`**, Historical Update Log, and Source Attribution.
