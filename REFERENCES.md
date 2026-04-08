# References

## Business Context

CareTracker is the core operational platform for SafeHarbor Behavioral Health, one of Adam James's businesses. SafeHarbor partners with community organizations (boxing gyms, dance studios, chess clubs, etc.) to provide Medicaid-billable behavioral health services to children ages 5-17. The whole-person model (Body, Mind, Spirit, Whole) is SafeHarbor's differentiator — teaching emotional wellness through activity, not lectures.

Every dollar of revenue comes from Medicaid billing. If documentation is wrong, claims get denied. CareTracker exists to make documentation bulletproof.

## Related Projects

- **Existing CareTracker (Legacy):** https://github.com/awjames6875/CareTrackr.git
  - React 18 + TypeScript + Vite + Express + PostgreSQL + Drizzle ORM
  - Hosted on Replit (being replaced by this rebuild)
  - Schema reference: `/shared/schema.ts`, seed data: `/server/seed.ts`

- **Curriculum Files (this folder):**
  - `JustTheBrethren_8Week_Curriculum_v2.docx` / `.pdf` — 81-page curriculum binder
  - `caretracker-data/treatment-goals.json` — 18 treatment goals (seed data)
  - `caretracker-data/daily-schedule.json` — 6-block schedule (seed data)
  - `caretracker-data/week-curriculum-map.json` — 8 weeks x 6 blocks (seed data)
  - `caretracker-data/jtb-activities.md` — Activity knowledge base
  - `CareTracker_PRD_v2.md` — Full PRD (3,074 lines, 16 sections)

## Key Contacts

- **Adam James** — Founder, SafeHarbor Behavioral Health + GrowthGenix + Integrity + OpenClaw
- **Saddie** — VA, handles GHL setup and operational tasks

## Existing Stack to Stay Compatible With

- **Supabase** — PostgreSQL + Auth + Row Level Security + Storage (HIPAA BAA available on Pro plan, $25/mo)
- **Vercel** — Deployment platform for Next.js
- **OpenAI** — GPT-4o for SOAP note generation and curriculum builder AI
- **Oklahoma ODMHSAS** — Medicaid billing authority (H2015-HA, H2014-HA, H2021-HA codes)

## Links & Docs

- **Supabase HIPAA Guide:** https://supabase.com/docs/guides/platform/hipaa
- **Next.js 14 App Router Docs:** https://nextjs.org/docs/app
- **Prisma Docs:** https://www.prisma.io/docs
- **shadcn/ui Docs:** https://ui.shadcn.com
- **TanStack Query Docs:** https://tanstack.com/query/latest
- **Zustand Docs:** https://zustand-demo.pmnd.rs/
- **ODMHSAS Provider Manual:** Oklahoma Department of Mental Health and Substance Abuse Services billing guidelines
- **Therap EHR:** https://www.therapservices.net/ (Phase 3 Chrome extension target)
