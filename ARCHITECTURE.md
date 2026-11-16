# CareTracker Architecture

## Purpose

This document explains how CareTracker is structured today.
It is the source of truth for:

1. Role-based app flows
2. Route and API boundaries
3. Data flow from logging to reporting
4. Privacy and compliance guardrails
5. Workspace boundaries in the 3-layer context system

## Read First

1. `global-constraints.md`
2. `CLAUDE.md`
3. `CONTEXT.md`

## Scope

This document covers the current production architecture for:

1. Role-based UI boundaries
2. API and data boundaries
3. Security and compliance boundaries

This document does not replace task-level implementation specs in `knowledge-base/`.

## System Overview

CareTracker is a Next.js app with role-based experiences for three user types:

1. Facilitator (tablet-first): logs what happened during the 6 daily blocks using big tap targets and simple language
2. Admin (desktop): manages partners, workers, and curriculum settings
3. Therapist (desktop): reviews logs and generates SOAP notes for documentation workflows

Core system parts:

1. Frontend: Next.js App Router under `src/app/`
2. API layer: route handlers under `src/app/api/`
3. Data layer: Prisma schema and migrations under `prisma/`
4. State and utilities: hooks and libs under `src/hooks/`, `src/lib/`, and `src/utils/`
5. Security controls: redaction, soft deletes, RLS expectations, and audit logging rules

## Route Architecture (Role-Based)

Top-level route groups in `src/app/`:

1. `(facilitator)/`
2. `(admin)/`
3. `(therapist)/`

Supporting routes:

1. `login/` for role-specific sign-in entry points
2. `api/` for server actions and data access
3. shared app shells: `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`

### Facilitator Routes

Purpose: fast logging while supervising kids.

Primary needs:

1. 4-digit PIN login
2. 6-block session logging flow
3. Minimal typing, mostly checkboxes and tap buttons
4. Offline-safe behavior when network is unstable

### Admin Routes

Purpose: setup and management.

Primary needs:

1. Partner management
2. Worker management
3. Curriculum builder/review workflows
4. Audit visibility and operational controls

### Therapist Routes

Purpose: review and documentation workflows.

Primary needs:

1. View pending logs
2. Generate SOAP notes (with PHI redaction before AI calls)
3. Review program/session history
4. Produce reporting inputs for billing operations

## Authentication Split

CareTracker supports two auth patterns by role:

1. Facilitator: PIN-based sign-in (speed-first)
2. Admin and Therapist: email/password sign-in

Design intent:

1. Facilitators need low-friction access on tablets in active environments
2. Admin and Therapist flows require stronger account identity and session management

Session timeout policy (from project guidance):

1. Therapist: 15 minutes
2. Facilitator: 1 hour

## API Architecture

API routes live in `src/app/api/` and are grouped by domain.
Current domains include:

1. `auth/`
2. `children/`
3. `curriculum/`
4. `notes/`
5. `observations/`
6. `partners/`
7. `programs/`
8. `reports/`
9. `admin/`

API conventions:

1. Validate input before database writes
2. Keep response messages simple
3. Do not log kid names in server logs
4. Prefer soft deletes instead of hard deletes

## End-to-End Data Flow

### A. Logging Flow (Facilitator)

1. Facilitator signs in with PIN
2. Opens current session and active block
3. Selects kid, color card, and behavior checkboxes
4. Optional short note is saved
5. Observation is stored (and queued/synced if offline mode applies)

Output: structured behavior logs linked to kid, block, worker, and session context.

### B. Review and Note Flow (Therapist)

1. Therapist opens pending logs
2. System assembles relevant observations and context
3. PHI redaction is applied before AI request
4. AI draft is generated and reviewed
5. Final note is saved with audit-safe handling

Output: completed documentation artifacts tied to underlying logs.

### C. Reporting Flow (Admin/Therapist)

1. Query observations and sessions by partner/date/program
2. Aggregate billable minutes by billing code and block
3. Return partner/date-range summaries

Output: internal reporting for compliance and billing operations.

## Core Data Model Map

Primary entities:

1. `Partner`: organization account boundary
2. `Worker`: staff identity and role
3. `Kid`: child enrolled in partner programs
4. `Program`: curriculum/program definition
5. `Session`: one scheduled program day
6. `Block`: one of the six daily blocks in a session
7. `Observation`: logged behavior event for a kid in a block

High-level relationships:

1. A partner has many workers, kids, and programs
2. A program has many sessions
3. A session has six blocks
4. An observation links one kid, one worker, one block, and one timestamp

Observation fields (conceptual):

1. Who/where: `kidId`, `workerId`, `blockId`
2. What happened: `colorCard`, `behaviors[]`, optional `note`
3. Lifecycle: `createdAt`, `isActive`

## Privacy and Compliance Boundaries

### PHI and Logging

1. No kid names in console logs
2. No names in URLs
3. Use IDs for diagnostics

### AI Safety

1. Redact PHI before any AI call
2. Restore only in trusted, authorized contexts after generation

### Data Lifecycle

1. Soft delete policy (`isActive: false`) for records
2. Preserve audit trail for operational and billing traceability

### Database Security

1. Supabase Row Level Security is required per table
2. Access should be scoped by role and partner boundaries
3. PHI access should be auditable

## Workspace Boundaries (3-Layer Map)

Top-level routing is defined in `CLAUDE.md` and divides work into four rooms:

1. `partner-feedback/` (feedback room): real user quotes and pain points
2. `knowledge-base/` (spec room): feature definitions and domain specs
3. `src/` (build room): UI, API, hooks, and implementation code
4. `prisma/` (data room): schema, migrations, and seed logic

Boundary rule:

1. Define what to build in feedback/spec rooms first
2. Implement in build/data rooms second
3. Validate against global constraints before merge

## Architectural Non-Negotiables

1. Keep facilitator workflows tap-first and fast
2. Keep staff-facing wording simple and free of clinical jargon
3. Keep privacy controls enforced by default
4. Keep reporting aligned to 6-block structure and billing codes
5. Keep architecture changes documented in this file when core flow changes

## Open Decisions To Track

1. Final offline sync conflict strategy for facilitator edits
2. Exact audit log schema coverage and retention policy details
3. Production deployment runbook finalization (`DEPLOY.md`)
