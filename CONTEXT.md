# Current Project

## What We Are Building

CareTracker is a multi-partner SaaS platform for SafeHarbor Behavioral Health. It replaces a manual process where therapists hand-write SOAP notes from facilitator observations. The app has 3 user types: facilitators (tablet, PIN login, checkboxes only), therapists (desktop, AI-generated SOAP notes), and admins (partner management, curriculum builder). Every minute of every program day maps to a Medicaid billing code.

## Current Priority (Phase 1 — MVP)

1. Supabase project setup + Prisma schema migration
2. Auth system (4-digit PIN for facilitators, email+password for therapists/admins)
3. Facilitator tablet UI — 6-block session view with observation logging
4. Therapist dashboard — pending notes queue + AI SOAP note generation
5. Admin panel — partner management + curriculum builder wizard
6. Billing reports (total billable minutes by code, by partner, by date range)
7. HIPAA compliance (RLS, audit log, PHI redaction, session timeouts)

## Existing Programs (Seed Data)

- **Body & Brain** — Dance-based program (existing, already running)
- **Just The Brethren** — Boxing, basketball, chess, geography, drums, music/dance, Mandarin, integration (8 weeks, 9 kids ages 5+)

Seed data files are in `/caretracker-data/` in the curriculums folder.

## What Good Looks Like

- Facilitator can complete a full 6-block session in <5 minutes of tapping
- All touch targets 48px minimum
- 5th-grade reading level on all facilitator text
- SOAP notes generate in <30 seconds with PHI redacted from AI calls
- Zero unbilled minutes in any report
- Copy-paste ready code outputs
- Step-by-step instructions Adam can follow alone

## What to Avoid

- Overengineering — ship MVP first, iterate later
- Complex forms — facilitators use checkboxes and big buttons, not text fields
- Clinical language anywhere in the facilitator interface
- Sending raw PHI to OpenAI — always redact first, restore after
- Breaking RLS policies for "convenience"
- Building Stripe/SaaS billing (that's Phase 3)
- Building the Therap Chrome extension (that's Phase 3)

## Development Phases

- **Phase 1 (Weeks 1-10):** MVP — Auth, facilitator tablet, therapist dashboard, SOAP notes, billing reports
- **Phase 2 (Weeks 11-16):** AI curriculum builder, offline mode, advanced reporting, multi-partner scaling
- **Phase 3 (Weeks 17+):** Therap EHR Chrome extension, Stripe SaaS billing, white-label
