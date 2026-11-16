# Contributing to CareTracker

## Purpose

This guide explains how to contribute safely and consistently.
Use it for setup, branch flow, pull requests, and quality checks.

Read these first before making changes:

1. `global-constraints.md`
2. `CLAUDE.md`
3. `CONTEXT.md`

## Scope

Use this guide for:

1. Local setup and branch workflow
2. Code, docs, and schema contributions
3. Pull request quality and review gates

This guide does not replace architecture decisions in `ARCHITECTURE.md`.

## Who This Is For

1. Project maintainers
2. New contributors
3. Contractors helping with features, fixes, docs, or data changes

## Ground Rules

1. Keep changes small and focused.
2. Follow the room model in `CLAUDE.md`.
3. Do not put PHI in logs, URLs, or screenshots.
4. Use simple wording in staff-facing copy.
5. Prefer soft deletes over hard deletes.

## Project Rooms

Work in the right folder for the job:

1. `partner-feedback/`: real user feedback and pain points
2. `knowledge-base/`: feature and domain specs
3. `src/`: UI, API, hooks, and implementation
4. `prisma/`: schema, migrations, and seed data

If a task touches multiple rooms, finish specs first, then code.

## Local Setup

Run these commands from the repo root.

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Run quality checks:

```bash
npm run lint
npm run type-check
npm test
npm run policy-check
```

4. Prisma workflows (only when needed):

```bash
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Branch Naming

Use one of these patterns:

1. `feat/<short-description>`
2. `fix/<short-description>`
3. `docs/<short-description>`
4. `chore/<short-description>`

Examples:

1. `feat/facilitator-session-progress`
2. `fix/pin-login-timeout`
3. `docs/update-architecture-map`

## Commit Guidelines

1. Make one logical change per commit.
2. Write clear commit messages.
3. Reference the room and feature when possible.

Suggested format:

```text
type(scope): short summary
```

Examples:

1. `feat(facilitator): add block progress indicator`
2. `fix(auth): handle expired facilitator session`
3. `docs(architecture): add system diagram`

## Change Workflow

1. Confirm task scope and room.
2. Read related files before editing.
3. Implement the smallest correct change.
4. Run required checks.
5. Open a pull request with a clear summary.

## Required Checks Before PR

Run all of the following unless the change type does not apply:

1. `npm run policy-check` (always required)
2. `npm run lint`
3. `npm run type-check`
4. `npm test`

For schema changes, also run:

1. `npm run db:migrate`
2. `npm run db:seed`

## Pull Request Checklist

Include this checklist in every PR description:

1. What changed and why
2. Which room(s) were touched
3. Screenshots or recordings for UI changes
4. Any migration or seed impact
5. Security and privacy checks completed
6. Commands run and results

Minimum pass criteria:

1. No PHI in logs, URLs, or error payloads
2. No banned clinical jargon in staff-facing copy
3. Touch targets and simple flow standards preserved for facilitator UI
4. Soft delete rules preserved

## Code Review Expectations

Reviewers should verify:

1. Scope is focused and does not include unrelated refactors
2. Naming matches conventions in `CLAUDE.md`
3. Feature behavior matches `knowledge-base/` specs
4. Privacy and security guardrails are intact
5. Tests and checks are appropriate for the change

## Database and Migration Rules

1. Use sequential migration names (`NNN_snake_case`).
2. Do not hard-delete records used in operational history.
3. Add indexes for common query paths.
4. Test migration impact locally before review.
5. Document any data backfill plan in the PR.

## Security and Privacy Review

Before merge, confirm:

1. PHI redaction path is unchanged for AI calls (`src/utils/redaction.ts`)
2. RLS expectations still hold for any new table or query path
3. Audit logging behavior remains intact for sensitive reads/writes

## Documentation Requirements

Update docs when behavior changes:

1. `ARCHITECTURE.md` for system flow changes
2. `CONTEXT.md` for priority and phase changes
3. `knowledge-base/` docs when specs change
4. `CHANGELOG.md` for user-visible updates

## What Not To Do

1. Do not merge code that skips `npm run policy-check`.
2. Do not ship large mixed-purpose PRs.
3. Do not add hidden behavior that is not documented.
4. Do not expose sensitive data in logs or URLs.

## Need Help?

1. Read the room-level `CLAUDE.md` in the folder you are touching.
2. Ask for a scope check before starting large work.
3. If uncertain, prefer a smaller PR and document open questions.
