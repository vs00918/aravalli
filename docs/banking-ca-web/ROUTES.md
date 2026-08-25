# Banking Current Affairs Web Application — Routes & Navigation Specification (Phase W1)

> **Document Version**: 1.0.0  
> **Status**: Routing & Information Architecture Baseline  
> **Target Framework**: Next.js App Router (`app/` directory)

---

## 1. Information Architecture Philosophy

The navigation hierarchy is designed around the student's cognitive workflow:
1. **Decision Flow**: *"What do I need to revise today?"* $\to$ **Dashboard & Revision Deck**.
2. **Canonical Exploration**: *"Tell me everything about RBI's monetary policy & lending rules"* $\to$ **Topics & Institution Hub**.
3. **Chronological Ingestion Flow**: *"What happened in August 2026 Week 3?"* $\to$ **Chronology & Batch Audits**.
4. **Instant Retrieval**: *"Find the 1.93% GNPA figure or Tata Sons NBFC-UL"* $\to$ **Global Search (`/search` or `Cmd+K`)**.

---

## 2. Complete Route Map & Parameters

```
/
├── /dashboard                              [Core Command Center: Today's Revision, Active P1s, Alerts]
├── /topics                                 [Canonical Knowledge Directory / Filters]
│   ├── /topics/category/[categoryId]       [Category Filter: e.g. /topics/category/banking-regulation]
│   └── /topics/[slug]                      [Single Canonical Topic Deep View (Progressive Disclosure)]
├── /revision                               [Revision Hub]
│   ├── /revision/deck                      [Interactive Time-Budgeted Revision Session Builder]
│   ├── /revision/p1                        [Strict P1 Master Portfolio (~50 min core study)]
│   ├── /revision/p2                        [P2 High Yield Fact Deck]
│   ├── /revision/changes                   [Change-Sensitive Tracker & Stale Fact Alerts]
│   └── /revision/recent                    [Recently Updated / Ingested Topics Feed]
├── /chronology                             [Chronological Archive Browser]
│   ├── /chronology/[year]/[month]          [e.g. /chronology/2026/08 - Monthly Batch View]
│   └── /chronology/[year]/[month]/[week]   [e.g. /chronology/2026/08/week-3]
├── /institutions                           [Regulatory Bodies & Institutions Directory]
│   └── /institutions/[institutionId]       [e.g. /institutions/rbi, /institutions/sebi]
├── /sources                                [Provenance & Ingestion Batch Audit Reports]
│   └── /sources/[batchId]                  [e.g. /sources/2026-08-cgb-part-2 - Accounting & Delta]
└── /search                                 [Instant Client-Side Full-Text Search Modal / Page]
```

---

## 3. Detailed Route Specifications

### 1. `/dashboard` (Core Command Center)
* **Purpose**: Immediate orientation upon opening the app.
* **Key Components**:
  * **Today's Revision Dial**: Quick-start buttons for `30-Min Core`, `60-Min Full P1`, and `15-Min Quick Scan`.
  * **Active P1 Master Carousel**: Clean cards for the 7 active P1 master topics with revision minute badges.
  * **Change-Sensitive Ticker**: Alerts for upcoming MPC meetings, draft consultation deadlines, and time-bound tax windows (FAST-DS).
  * **Recent Ingestions**: Audit snapshot from the latest batch.

---

### 2. `/topics/[slug]` (Canonical Topic Deep View)
* **Purpose**: Full pedagogical study interface for a single regulatory event.
* **Layout Structure (Progressive Disclosure)**:
  * **Header**: Topic Title, Primary Institution (`RBI`), Category Badge, Priority Badge (`P1`), Regulatory Status (`DRAFT`), Verification Badge (`SOURCE_ONLY`), Estimated Revision Time (`~8 min`).
  * **Section 1: 3-Minute Must Memorize Deck**: Bold bullet points highlighting critical numbers and statutory sections.
  * **Section 2: Conceptual Mechanism (Know / Understand)**: Plain-English explanation translating regulatory jargon.
  * **Section 3: Optional Details & History**: Chronological update timeline (`TopicUpdate[]`).
  * **Section 4: Source Provenance**: Audit trail showing which coaching PDFs contributed to this note.

---

### 3. `/revision/deck` (Dynamic Time-Budgeted Revision Engine)
* **Purpose**: Generates a deterministic study deck tailored to the student's available time.
* **URL Query Parameters**:
  * `?time=30` $\to$ Automatically selects top 4 P1 topics totaling $\le 30$ minutes.
  * `?time=60` $\to$ Selects all 7 active P1 topics (~51 min) + top change-sensitive P2 item.
  * `?priority=P1` | `?priority=P2` | `?filter=changes_only`
* **Interaction**: Flashcard-style summary or focused list view with one-click completion toggles stored in `localStorage`.

---

### 4. `/institutions/[institutionId]` (Institution Intelligence Hub)
* **Purpose**: Aggregates all circulars, master directions, and appointments by regulator.
* **Examples**:
  * `/institutions/rbi`: Groups MPC, UCB on-tap norms, NBFC-UL Tata Sons, Interest rate draft, DEA fund, and loan recovery rules.
  * `/institutions/sebi`: Groups Single Form A, Credit Risk-o-Meter, Municipal bond limits, and F&O loss reports.

---

### 5. `/chronology/[year]/[month]` (Chronological Archive)
* **Purpose**: Allows browsing by when coaching magazines or exams released the news.
* **Crucial Invariant**: Links directly to the canonical topic pages (`/topics/[slug]`) rather than duplicating the note content.
