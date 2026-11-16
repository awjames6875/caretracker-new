# CLAUDE.md — The Build Room

**Location:** `src/`

---

## Purpose of This Room

This is where we **build the actual app**. Components, pages, API routes, hooks, utilities — all the code lives here.

---

## ⚠️ Before Writing Any Code

1. Read `global-constraints.md` (banned words, reading level)
2. Check `partner-feedback/` for relevant user complaints
3. Review specs in `knowledge-base/` for feature requirements

---

## The Golden Rule

**Staff are watching kids while using this app.**

They have one hand on a clipboard, one eye on a 6-year-old, and 5 seconds to tap a button. Design for that reality.

---

## UI Requirements (Non-Negotiable)

### Touch Targets
- Minimum size: **48px × 48px**
- Preferred size: **64px × 64px** for primary actions
- Spacing between targets: **8px minimum**

### Text
- Body text: **16px minimum** (18px preferred on tablet)
- Button labels: **18px minimum**
- No jargon — if a 10-year-old wouldn't know the word, don't use it

### Colors
- High contrast only (WCAG AA minimum)
- Color cards: Green (`#22c55e`), Yellow (`#eab308`), Red (`#ef4444`)
- Never rely on color alone — add icons or text labels too

### Forms
- **Checkboxes > text fields** (tapping > typing)
- **Pre-filled defaults** (today's date, current block auto-selected)
- **One question per screen** for facilitator flows
- **Auto-save** everything (assume they'll get interrupted mid-session)

### Feedback
- Every tap shows immediate visual feedback (color change, checkmark)
- Loading states for anything over 200ms
- Error messages in plain language: "Couldn't save. Try again." not "500 Internal Server Error"

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (facilitator)/      # Tablet UI for staff logging behaviors
│   ├── (admin)/            # Desktop UI for program managers
│   ├── (therapist)/        # Desktop UI for SafeHarbor review
│   ├── api/                # API routes
│   └── login/              # Auth pages
│
├── components/
│   ├── facilitator/        # Big buttons, checkboxes, color cards
│   ├── admin/              # Forms, tables, dashboards
│   ├── therapist/          # Review queues, editors
│   ├── shared/             # Used across roles
│   └── ui/                 # Base UI primitives
│
├── hooks/                  # Custom React hooks
├── lib/                    # Core utilities, clients, constants
├── types/                  # TypeScript type definitions
├── utils/                  # Helper functions
└── styles/                 # Global CSS, variables
```

---

## Component Guidelines

### Naming
- **PascalCase.tsx** — `KidCard.tsx`, `ColorButton.tsx`, `BlockHeader.tsx`
- Simple words only — `SaveButton` not `ObservationPersistenceButton`
- Group by role folder: `facilitator/`, `admin/`, `therapist/`, `shared/`

### Facilitator Components Must:
- Work offline (use `useLocalStorage` hook for drafts)
- Have touch targets ≥ 48px
- Show loading and success states
- Use only simple words in all labels

---

## API Route Guidelines

### Naming
- Action verbs: `save.ts`, `list.ts`, `approve.ts`, `generate.ts`
- NOT: `handleObservationSubmission.ts`

### Rules
- Always validate input with Zod before touching the database
- Never log kid names — use IDs only in server logs
- Return simple error messages to the client
- Soft deletes only — never `DELETE` records, set `isActive: false`

---

## State Management

| Type | Tool | When to Use |
|------|------|-------------|
| Server state | TanStack Query | Fetching and caching API data |
| Client state | Zustand | UI state, modal open/closed, etc. |
| Persistent local | `useLocalStorage` | Offline data, session drafts |
| Forms | react-hook-form + Zod | Any form with validation |

---

## Offline-First (Facilitator Only)

The facilitator UI must work without internet:

1. Save all observations to localStorage immediately on tap
2. Show "Saved ✓" even when offline
3. Sync to server when connection returns
4. Never block the UI waiting for network response

See `src/utils/offline.ts` for the sync queue implementation.
