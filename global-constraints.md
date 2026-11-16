# Global Constraints — The "Never Do This" List

**BLOCKING REQUIREMENT:** Read this file BEFORE starting ANY task in this workspace.

These rules apply to EVERY folder, EVERY file, EVERY line of code or text you write.

---

## Rule 1: 5th-Grade Reading Level (Flesch Score 80+)

All user-facing content must be readable by a 10-year-old:

- **UI text:** Button labels, form labels, error messages, tooltips
- **Component names:** Use simple words (`KidCard` not `ParticipantProfileComponent`)
- **Documentation:** Instructions for facilitators, help text, onboarding
- **Variable names in UI:** `kidName` not `participantIdentifier`

**Test yourself:** If you need to explain a word, use a simpler word.

| ❌ Don't Write | ✅ Write Instead |
|----------------|------------------|
| "Submit observation" | "Save" |
| "Participant exhibited dysregulation" | "Kid needed a break" |
| "Authentication failed" | "Wrong PIN. Try again." |
| "Session terminated" | "Done for today" |

---

## Rule 2: ZERO Clinical/Medical/Diagnostic Jargon

This app is for **daycare workers, boxing coaches, nonprofit volunteers, and gym staff** — NOT clinicians.

### Banned Words (NEVER use in UI, components, or user-facing docs):

**Clinical terms:**
- therapy, therapist, counselor, counseling, clinician
- assessment, evaluation, diagnosis, treatment plan
- intervention, therapeutic, clinical

**Diagnostic terms:**
- ADHD, ODD, ASD, anxiety, depression, bipolar, manic
- dysregulation, dysregulated, triggered, trauma response
- oppositional, defiant, conduct disorder
- Any DSM-5 terminology

**Medical terms:**
- patient, client (use "kid" or "child")
- symptoms, presenting behaviors
- mental health, behavioral health (in UI)

### Approved Replacement Words:

| ❌ Banned | ✅ Use Instead |
|-----------|----------------|
| clinical assessment | behavior log |
| therapeutic intervention | helping the kid |
| dysregulated | upset, frustrated, needed a break |
| treatment goals | what we're working on |
| patient/client | kid, child |
| therapist | staff, team lead |
| session notes | daily log |
| behavioral observation | what I saw today |

---

## Rule 3: Massive UI Simplicity

Staff are **watching kids while using this app**. They have 5 seconds, not 5 minutes.

### Hard Requirements:

1. **Touch targets:** Minimum 48px × 48px (thumb-friendly)
2. **One action per screen:** Don't make them think
3. **Big buttons > text fields:** Checkboxes and taps, not typing
4. **No scrolling forms:** If it scrolls, break it into steps
5. **Instant feedback:** Every tap shows something changed
6. **Offline-first:** Assume WiFi will fail at the worst moment

### UI Patterns to Follow:

- ✅ Large colored buttons (Green/Yellow/Red cards)
- ✅ Pre-filled checkboxes for common behaviors
- ✅ One kid per screen during logging
- ✅ Progress bar showing "3 of 6 blocks done"
- ❌ Dropdown menus (too small, too slow)
- ❌ Date pickers (auto-fill today's date)
- ❌ Multi-select lists (use big toggle buttons)

---

## Rule 4: Privacy Without Paranoia

We handle kid data. Be careful, but don't overcomplicate.

1. **Never log names to console** — use IDs only in dev logs
2. **Never put names in URLs** — `/kid/abc123` not `/kid/johnny-smith`
3. **Redact before AI calls** — see `src/utils/redaction.ts`
4. **Soft deletes only** — never actually delete records

---

## Quick Self-Check Before Any Output

Before writing code, UI text, or documentation, ask:

1. Would a busy daycare worker understand this in 2 seconds?
2. Does any word sound like it belongs in a doctor's office?
3. Can this be done with fewer taps?
4. Is the button big enough to hit while holding a clipboard?

If any answer is "no" — simplify.
