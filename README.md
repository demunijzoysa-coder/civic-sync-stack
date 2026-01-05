# CivicSync Stack

**Offline-First Digital Public Infrastructure for Reliable Service Delivery**

---

## Overview

CivicSync Stack is an **offline-first, event-driven digital public infrastructure** designed for environments with **unreliable or limited internet connectivity**.

Unlike typical government or civic applications that assume continuous connectivity, CivicSync is built on the assumption that **networks will fail**, devices will go offline, and synchronization will be delayed.

The system provides a **shared infrastructure layer** that enables government agencies, NGOs, and civic institutions to deliver critical services reliably—even on 2G/3G networks or in fully offline conditions.

This is **not a single application**.  
It is a **reusable infrastructure primitive**.

---

## Why This Exists

In countries like Sri Lanka and many other developing regions:

- Internet connectivity is unstable or unavailable in rural areas
- Government systems are over-centralized and fragile
- Citizens repeatedly submit the same data across multiple offices
- Field officers rely on paper workflows due to unreliable systems
- Most digital initiatives focus on “apps” instead of infrastructure

Most solutions fail because they treat **connectivity as a given**.

CivicSync treats **offline operation as the default**.

---

## Core Principles

1. **Offline-First by Design**
   - All user actions work without an internet connection
   - Data is stored locally and survives refresh, restart, and power loss

2. **Event-Based Synchronization**
   - All changes are recorded as immutable sync events
   - Events are synchronized when connectivity becomes available

3. **Idempotent & Auditable**
   - Duplicate sync attempts do not corrupt state
   - Every change is traceable, timestamped, and verifiable

4. **Infrastructure, Not a One-Off App**
   - Designed to support multiple services (health, land, agriculture, utilities)
   - Shared contracts and sync engine across clients

5. **Human-Centered Failure Handling**
   - Supports delayed sync, retries, and human-in-the-loop verification
   - Designed for real field conditions, not ideal demos

---

## What This System Does

At a high level, CivicSync provides:

- **Offline data capture** (via web or mobile clients)
- **Local persistence** using IndexedDB (browser) or equivalent storage
- **Outbox pattern** for reliable event delivery
- **Batch-based sync** to backend services
- **Idempotent ingestion** on the server
- **Projection into read models** (e.g., appointments, records)
- **Audit-friendly event log**

---

## Example Use Cases

CivicSync can be used as the foundation for:

- Clinic appointment booking in rural health centers
- Agriculture subsidy or fertilizer claim submissions
- Land record updates by field officers
- Utility service requests and inspections
- Disaster relief registration
- Census or survey data collection

The current implementation demonstrates a **clinic appointment workflow**, but the architecture is **domain-agnostic**.

---

## Architecture Overview

### Client (Offline-First Web App)
- React + TypeScript
- IndexedDB via Dexie
- Outbox queue for sync events
- Manual and future automatic sync triggers
- Works fully offline

### Shared Contracts
- Centralized schemas and types
- Ensures client/server consistency
- Prevents drift between systems

### Sync Core
- Validation and normalization of sync events
- Enforces required payloads and rules
- Shared across clients and backend

### Backend API
- Fastify (Node.js)
- PostgreSQL
- Event log (`sync_events`)
- Idempotent inserts using event IDs
- Projection into domain tables (e.g., appointments)

### Infrastructure
- Docker-based local development
- Designed for containerized deployment

---

## Repository Structure
civic-sync-stack/
├── apps/
│ ├── web/ # Offline-first client (IndexedDB + outbox)
│ └── api/ # Backend API + persistence
├── packages/
│ ├── shared/ # Shared schemas and types
│ └── sync-core/ # Sync validation and rules
├── infra/
│ └── docker/ # Local infrastructure (Postgres)
└── docs/
└── architecture/ # Design and system documentation


---

## Current Capabilities

- Offline appointment creation
- Persistent local storage (survives refresh and restart)
- Submit action creates sync events
- Outbox pattern with retry support
- Manual sync trigger
- Backend idempotent ingestion
- PostgreSQL persistence
- Verified duplicate-safe sync behavior

---

## Roadmap

Planned next steps include:

- Automatic background sync and retry
- Conflict detection and resolution strategies
- Authentication and device identity
- Role-based access control
- SMS / USSD fallback integration
- Multi-service support on a shared sync layer
- Production deployment configurations
- Documentation for NGO and government adoption

---

## Who This Is For

- Government digital transformation teams
- Civic-tech organizations
- NGOs working in low-connectivity environments
- Public health and agriculture programs
- Engineers interested in **real-world systems design**

---

## Why This Matters

This project intentionally avoids flashy UI or startup demos.

It focuses on the **boring, hard problems**:
- unreliable networks
- partial failures
- delayed consistency
- auditability
- long-term maintainability

That is precisely why it is valuable.

---

## Status

This project is **actively developed** and intended as:
- A reusable infrastructure foundation
- A reference architecture for offline-first public systems
- A portfolio-grade demonstration of systems thinking

---

## License

MIT License — intended to encourage reuse, adaptation, and public-good deployments.

---

## Author

Built as part of an exploration into **offline-first digital public infrastructure** for real-world conditions, with a focus on emerging economies.

---

> “Connectivity should be an optimization, not a requirement.”
