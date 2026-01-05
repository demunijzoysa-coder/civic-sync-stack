# Civic Sync Stack

Offline-first Digital Public Infrastructure (DPI) primitives for low-connectivity environments:
- Offline form capture (PWA)
- Resilient delayed sync (store-and-forward)
- Interfaces designed for SMS/USSD fallback (phase 2)
- Human-in-the-loop verification (workflow-ready)

This repository is designed to be deployable for government/utility workflows in regions with unstable connectivity (2G/3G), while remaining reusable internationally.

---

## Why this exists

Many public services fail not because forms are hard, but because connectivity is unreliable and systems are over-centralized. Most teams build one-off apps; few build reusable infrastructure primitives that work under real constraints.

Core constraints addressed:
- intermittent internet
- delayed synchronization
- data integrity and auditability
- low bandwidth fallback readiness

---

## MVP scope (current)

**Deliverable:** one end-to-end workflow using shared infrastructure primitives.

MVP includes:
- Offline-first PWA (drafts work fully offline)
- Sync engine (local → server, retry/backoff)
- Backend API + PostgreSQL
- One real use case module (selected in `/docs`)

---

## Monorepo structure

- `apps/web` — Offline-first PWA client
- `apps/api` — Backend API (sync endpoints, persistence)
- `packages/sync-core` — Shared sync logic, payload contracts
- `packages/shared` — Shared types, validators, utilities
- `infra/docker` — Docker Compose for local/dev
- `docs` — Architecture docs, ADRs, API notes

---

## Tech stack

- Node.js + TypeScript (monorepo via pnpm)
- Web: React + Vite + PWA + IndexedDB (Dexie)
- API: Node (Fastify or NestJS) + PostgreSQL
- Docker Compose for local environment

---

## Getting started (local dev)

### Prerequisites
- Node.js (LTS)
- pnpm
- Docker + Docker Compose

### 1) Install dependencies
```bash
pnpm install
