# Mind of Aravalli — Engineering Architecture

## 1. System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Next.js 14 App Router                │
│  (React Server Components + Client Interactive Islands)│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               Data Access Layer (DAL)                  │
│  lib/db/ (chapters, concepts, connections, sources...) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Prisma ORM                          │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                 SQLite Database (dev.db)               │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
mind-of-aravalli/
├── app/                        # Next.js 14 App Router
│   ├── add/                    # Add to Aravalli capture page
│   ├── api/                    # JSON REST & search endpoints
│   │   ├── capture/            # Source capture endpoint
│   │   ├── search/             # Global search endpoint
│   │   ├── inbox/[id]/         # Ingestion processing & promotion
│   │   └── concepts/[slug]/    # Concept updates
│   ├── chapters/[slug]/        # Master Chapter detailed view
│   ├── concepts/[slug]/        # 6-Layer Concept Reading Experience
│   ├── connections/            # The Knowledge Lattice
│   ├── inbox/                  # Staging review desk (/inbox & /inbox/[id])
│   ├── library/                # Master Library Volume Catalog
│   ├── questions/              # Curiosity Radar
│   ├── sources/                # Sources & Provenance Catalog
│   ├── not-found.tsx           # Scholarly 404 handler
│   ├── error.tsx               # Calm error boundary
│   ├── layout.tsx              # Root layout & theme wrapper
│   └── page.tsx                # Dynamic Encyclopedia Dashboard
├── components/
│   ├── brand/                  # Logo & visual identity
│   ├── chapters/               # Chapter header, TOC, and concept lists
│   ├── concepts/               # 6-layer concept reading components & editor
│   ├── home/                   # Dashboard preview sections
│   ├── inbox/                  # Research desk review component
│   ├── layout/                 # Header, Footer, ThemeProvider
│   ├── search/                 # Global search modal (Ctrl+K)
│   └── ui/                     # KaTeX MathBlock & MathInline
├── lib/
│   ├── data/                   # Chapter curriculum roadmaps
│   ├── db/                     # Data Access Layer (DAL) repositories
│   ├── ingestion/              # Ingestion providers & extraction pipeline
│   ├── types/                  # TypeScript domain models & contracts
│   └── utils/                  # Styling & helper utilities
├── prisma/
│   ├── schema.prisma           # Relational schema
│   └── seed.ts                 # Scientific seed data
├── docs/                       # Architectural & product specifications
│   ├── PRODUCT.md
│   └── ARCHITECTURE.md
├── README.md                   # Project overview & quickstart
└── package.json                # Dependencies & scripts
```

---

## 3. Key Invariants & Design Principles

1. **Strict Repository Isolation**: Confined 100% to `vs00918/aravalli` on `main`.
2. **DAL Abstraction**: UI components and server actions never query Prisma directly. All database access flows through `lib/db/`.
3. **Pluggable Ingestion Provider**: Extracted proposals use the `ExtractionProvider` interface, currently powered by `LocalDemonstrationProcessor` without requiring external AI API keys.
4. **KaTeX Math Engine**: Mathematical formulas rendered server-side and client-side with full overflow protection for mobile viewports.
5. **Human-in-the-Loop Review Boundary**: Uncommitted research stays in `IngestionItem` until explicitly audited and promoted by the user.

---

## 4. Development & Build Commands

```bash
# Start local development server
npm run dev

# Run TypeScript type validation
npm run type-check

# Run ESLint validation
npm run lint

# Compile production build
npm run build

# Seed knowledge database
npm run db:seed
```
