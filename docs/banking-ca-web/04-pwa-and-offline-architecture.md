# Banking Current Affairs Mentor — PWA & Offline Architecture

## 1. Overview & Architectural Role

The PWA layer provides reliable, installable, offline study access for the Banking Current Affairs Study OS across laptops, desktops, tablets, and mobile devices.

```
┌─────────────────────────────────────────────────────────────┐
│ CANONICAL KNOWLEDGE (knowledge-tree/banking-ca/*.md)        │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ VALIDATED REGISTRY (data/banking-ca-registry.json)          │
└──────────────┬───────────────────────────────┬──────────────┘
               ▼                               ▼
┌──────────────────────────────┐┌──────────────────────────────┐
│ NEXT.JS STATIC APP SHELL     ││ PERSONAL STUDY STATE         │
│ (/dashboard, /topics, etc.)  ││ (localStorage / repository)  │
└──────────────┬───────────────┘└──────────────┬───────────────┘
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│ W7 SERVICE WORKER & CACHE LAYER (public/sw.js)              │
│ - Static Cache: ca-static-v1 (Shell, Fonts, Icons)          │
│ - Data Cache: ca-data-v1 (banking-ca-registry.json)         │
│ - Pages Cache: ca-pages-v1 (Visited HTML Documents)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Cache Strategy Orchestration

| Resource Type | Cache Target | Strategy | Rationale |
| :--- | :--- | :--- | :--- |
| **Static Assets** (`/_next/static/`, `/icons/`, CSS, JS) | `ca-static-v1` | **Cache-First** | Versioned, immutable build artifacts. Instant loading. |
| **Data Registry** (`banking-ca-registry.json`, `/data/`) | `ca-data-v1` | **Stale-While-Revalidate** | Instant offline response from cache, background refresh when online. |
| **HTML Navigation** (`mode === 'navigate'`) | `ca-pages-v1` | **Network-First with Cache Fallback** | Serves latest page online; falls back to cached page or `/offline`. |
| **Offline Fallback** (`/offline`) | `ca-static-v1` | **Pre-cached** | Clean user-facing fallback when a page was not previously visited. |

---

## 3. Update Lifecycle & Cache Versioning

1. **Pre-caching**: On `install`, the service worker pre-caches the core application shell and icons.
2. **Eviction**: On `activate`, any cache keys not belonging to the current `CACHE_VERSION` are deleted.
3. **Controlled Activation**: When a new service worker is installed in the background, a non-intrusive `Update Available` toast is displayed.
4. **User-Triggered Refresh**: Clicking `"Update Now"` posts `{ type: 'SKIP_WAITING' }`, activates the new worker, and reloads the window on `controllerchange`.

---

## 4. Offline Capabilities Matrix

| Feature | Offline Status | Underlying Data Source |
| :--- | :---: | :--- |
| **Topic Reader** | ✅ **Full Access** | Cached HTML pages & `banking-ca-registry.json` |
| **15/30/60m Revision Hub** | ✅ **Full Access** | In-memory greedy selector over cached registry |
| **Active Recall Prompts** | ✅ **Full Access** | Deterministic question extraction from mustMemorizeFacts |
| **Self-Rating (`AGAIN`..`EASY`)** | ✅ **Full Access** | Browser-local `localStorage` via `RevisionStateRepository` |
| **Universal Search** | ✅ **Full Access** | In-memory client-side deterministic search engine |
| **Institutions & Chronology** | ✅ **Full Access** | Cached index summaries from registry |

---

## 5. Security & Isolation Invariant

- **Zero Secrets in PWA Assets**: Manifest, service worker, and cached files contain zero API keys, GitHub tokens, or private environment variables.
- **Local Personal State**: Student ratings and review counts remain strictly on the local device and are never transmitted to external servers.
