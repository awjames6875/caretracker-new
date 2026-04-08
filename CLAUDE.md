# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CareTracker is a HIPAA-compliant, multi-partner SaaS platform for SafeHarbor Behavioral Health. It turns community partner activities into billable, trauma-informed behavioral health programs. Built for Oklahoma ODMHSAS billing compliance.

**Current state:** Scaffolded file structure with key constants/billing-codes implemented. Most source files are empty stubs awaiting implementation.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint with --fix on src/
npm test             # Run Jest test suite
npm run test:watch   # Jest in watch mode
npm run type-check   # TypeScript check (tsc --noEmit)
npm run db:migrate   # Prisma migrate dev
npm run db:seed      # Seed database (ts-node prisma/seed.ts)
npm run db:studio    # Open Prisma Studio GUI
```

## Architecture

### Role-Based Route Groups (Next.js 14 App Router)

The app uses Next.js route groups to separate three user roles, each with its own layout:

- `src/app/(facilitator)/` — Tablet-first UI for field staff running daily sessions. Must work offline.
- `src/app/(therapist)/` — Desktop UI for clinicians reviewing observations, generating SOAP notes, managing children/goals.
- `src/app/(admin)/` — Admin dashboard for partners, workers, curriculum builder, audit logs.

Each group has its own `layout.tsx`. Auth determines which group a user accesses.

### API Layer

API routes live at `src/app/api/` using `.ts` files with `index.ts` and named files (e.g., `approve.ts`, `generate.ts`).

Key API domains: `auth/`, `children/`, `curriculum/`, `notes/`, `observations/`, `partners/`, `programs/`, `reports/`.

### Data Flow: Observation to Billing

1. **Facilitator** records observations during session blocks on tablet (offline-capable)
2. **Observations** are tagged with a block number, which maps to a billing code via `DAILY_BLOCKS` in `src/lib/billing-codes.ts`
3. **Therapist** reviews observations, triggers AI SOAP note generation (`src/app/api/notes/generate.ts`)
4. **Therapist** approves/rejects notes via approval workflow
5. **Reports** generate billing-ready output mapped to H-codes

### Key Lib Files

- `src/lib/billing-codes.ts` — Canonical billing code definitions, daily block structure, activity type mappings. **The 6-block structure is immutable.**
- `src/lib/constants.ts` — Session timeouts, pillar definitions, color cards, role enums
- `src/lib/curriculum-engine.ts` — AI-powered curriculum generation
- `src/lib/openai.ts` — OpenAI client (GPT-4o for SOAP notes + curriculum)
- `src/lib/supabase.ts` — Supabase client
- `src/lib/prisma.ts` — Prisma client singleton
- `src/utils/redaction.ts` — PHI redaction before sending to OpenAI

### State Management

- **Server state:** TanStack Query (React Query v5)
- **Client state:** Zustand
- **Forms:** react-hook-form + Zod validation
- **Offline:** `src/utils/offline.ts` + `src/hooks/useLocalStorage.ts` for facilitator tablet sync

## Domain Rules

### Language Rules (SafeHarbor-Specific)

NEVER use in user-facing text, facilitator scripts, treatment goals, or documentation:
- therapy, therapist, counselor, counseling
- ADHD, ODD, oppositional, dysregulation, anxiety, depression, manic, triggered
- behavioral disorder, mental health diagnosis, clinical assessment
- Any DSM-5 diagnostic terminology

USE instead: "focuses", "listens", "controls their body", "works with friends", "names their feelings", "staff", "facilitator", "lead instructor", "program", "activity". Observable behavioral language only.

### HIPAA Requirements

1. Never log PHI to console or put PHI in URLs
2. Redact PHI before sending to OpenAI (`src/utils/redaction.ts`)
3. Every table must have Supabase Row Level Security policies
4. All PHI access must create an audit log entry
5. Session timeouts: 15 min therapist, 1 hour facilitator (`src/lib/constants.ts`)
6. Never delete data — use soft deletes (`isActive: false`) for Medicaid audit trail

### Billing Codes (Oklahoma ODMHSAS)

| Code | Service | When Used |
|------|---------|-----------|
| H2015-HA | Community Support | Check-in, breaks, reflection, closing |
| H2014-HA | Skills Training | Skill lessons, stations, group games |
| H2021-HA | BHRS Regulation | GYM/movement activities (60 min minimum) |

### 6-Block Daily Structure (NEVER change)

| Block | Time | Code | Type |
|-------|------|------|------|
| 1. Check-In | 15 min | H2015-HA | engagement |
| 2. Skill Lesson | 25 min | H2014-HA | skills_training |
| 3. GYM Activity | 60 min | H2021-HA | regulation |
| 4. Break/Reset | 15 min | H2015-HA | engagement |
| 5. Stations & Game | 35 min | H2014-HA | skills_training |
| 6. Reflection | 30 min | H2015-HA | engagement |

Total: 180 minutes = 3 billable hours per day. Zero dead time — every minute maps to a billing code.

### Color Cards System

- GREEN = Ready (thumbs up)
- YELLOW = Help (30-60 sec, staff kneels, offers choices)
- RED = Break (2 min max, timer, one choice, rejoin)

### Four Pillars

Defined in `src/lib/constants.ts` as `PILLARS`:
- Physical Regulation (Body)
- Cognitive Control (Mind)
- Emotional Expression (Spirit)
- Social Identity (Whole)

### Facilitator UI Constraints

- All text must score 80+ on Flesch readability (5th grade level)
- Offline-first with sync-on-reconnect
- Minimum touch target: 48px (tablet accessibility)

## Interaction Preferences

Adam has ADHD. Always:
- Number every step — no skipping
- One task at a time — wait for confirmation
- Copy-paste ready commands only
- Warn before any step that could break something or cost money


<claude-mem-context>
# Recent Activity

<!-- This section is auto-generated by claude-mem. Edit content outside the tags. -->

*No recent activity*
</claude-mem-context>