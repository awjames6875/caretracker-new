# CLAUDE.md — The Feedback Room

**Location:** `partner-feedback/`

---

## Purpose of This Room

This folder contains **real quotes and feedback from our partner organizations** — the daycares, boxing gyms, nonprofits, and community centers that actually use CareTracker.

**Why it exists:** Features should be built based on what real users say, not what we assume they need.

---

## What Goes Here

- Direct quotes from partner staff ("I hate how many screens it takes to log a tantrum")
- Feature requests from program managers
- Complaints and pain points
- Screenshots of confusing UI moments
- Notes from partner check-in calls

### File Format

Name files by partner and date: `daycare-name_2026-04.md`

Each file should follow this structure:

```markdown
## [Partner Name] — [Date]

**Source:** Phone call / Email / In-person visit

**Quote:**
> "I wish I could just tap one button when a kid has a meltdown instead of filling out a whole form."

**What this tells us:**
- Current flow has too many steps
- Need a "quick log" option for common behaviors

**Priority:** High / Medium / Low
```

---

## How to Use This Room

### When Building Features (in `src/`)

1. Before designing a new feature, check this folder for related feedback
2. Search for keywords: "confusing", "slow", "hate", "wish", "too many"
3. Let real complaints guide your UI decisions

### When Writing Specs (in `knowledge-base/`)

1. Ground feature specs in actual partner needs
2. Quote partners directly: "Boxing coach said X, so we're building Y"

---

## Current Partners

| Partner | Type | Key Contact | Notes |
|---------|------|-------------|-------|
No partners named yet. Add 1 row per partner when Adam names one.

---

## Remember

Every piece of feedback here represents a **real person watching real kids** who found our app frustrating. Treat their words seriously. One complaint from a coach = probably 10 coaches having the same problem and not saying anything.
