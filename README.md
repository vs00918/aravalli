# Mind of Aravalli 🌲

> **A living personal encyclopedia that turns scattered information into structured, connected, durable understanding.**

---

## 📖 Overview
**Mind of Aravalli** is a greenfield Personal Knowledge System and digital encyclopedia designed to help curious minds transform raw information from lectures, books, podcasts, and papers into a coherent, enduring body of knowledge.

### Core Principles:
1. **Understanding > Summarization**: Focus on fundamental physical truths and mental models.
2. **Concepts > Documents**: Ideas are first-class citizens organized into living master chapters.
3. **Connections > Silos**: Defensible cross-domain isomorphisms linking physics, biology, technology, and society.
4. **Clarity & Traceability**: Human-readable, layered explanations grounded in traceable sources.

---

## 🛠️ Technology Stack
* **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Aravalli Scholarly Theme)
* **Database & ORM**: [Prisma](https://www.prisma.io/) with SQLite (local development) / PostgreSQL (production-ready)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Initialization
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure
```text
mind-of-aravalli/
├── app/                  # Next.js App Router (Layouts & Pages)
├── components/           # Reusable UI & Layout Components
├── lib/                  # Application Core (DB, Types, Utils)
├── prisma/               # Database Schema & Migrations
├── docs/                 # Technical Architecture Documentation
└── MIND_OF_ARAVALLI_MASTER_SPEC.md # Master Product Specification
```

---

## 📜 Commands
* `npm run dev`: Start local development server.
* `npm run build`: Generate Prisma client and compile Next.js production build.
* `npm run lint`: Run ESLint checks.
* `npm run type-check`: Run TypeScript compiler check (`tsc --noEmit`).
* `npm run db:push`: Push Prisma schema changes to local database.
* `npm run db:studio`: Open Prisma Studio visual database browser.

---

## 🔒 Repository Isolation Invariant
All operations, commits, and developments are strictly confined to [**`https://github.com/vs00918/aravalli`**](https://github.com/vs00918/aravalli).
