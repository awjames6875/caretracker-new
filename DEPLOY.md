# CareTracker Deployment Runbook

## Purpose

This runbook is the single reference for deploying CareTracker safely.
It covers:

1. Pre-deploy checks
2. Environment setup
3. Deployment steps
4. Post-deploy validation
5. Rollback steps

Read these first:

1. `global-constraints.md`
2. `CLAUDE.md`
3. `ARCHITECTURE.md`

## Scope

Use this for production-like deploys of:

1. App code changes in `src/`
2. API route updates in `src/app/api/`
3. Prisma schema or migration changes in `prisma/`

Do not use this as a database migration design guide. Use `prisma/CLAUDE.md` for schema conventions.

## Pre-Deploy Checklist

Before deployment starts, confirm:

1. Branch is clean and reviewed
2. PR is approved
3. `npm run policy-check` passes
4. `npm run lint` passes
5. `npm run type-check` passes
6. `npm test` passes
7. Release notes are prepared
8. Rollback owner is assigned

## Environment Requirements

Required services:

1. Next.js runtime target is available
2. Database is reachable
3. Auth provider is reachable
4. Logging and monitoring are enabled

Expected environment variables include values for:

1. Database connection
2. Auth configuration
3. OpenAI integration
4. Session and security settings

Rule: never print secret values in logs or tickets.

## Deployment Strategy

Use a safe, staged approach:

1. Deploy schema changes first (when needed)
2. Deploy application code second
3. Run smoke checks immediately
4. Watch logs and metrics during stabilization

If deploy includes both schema and app changes, schema must be backward-compatible for the app version transition.

## Standard Deployment Steps

### 1. Prepare Release

1. Confirm target commit SHA
2. Confirm migration list for this release
3. Confirm no emergency incidents are active

### 2. Run Local Final Checks

```bash
npm run policy-check
npm run lint
npm run type-check
npm test
npm run build
```

### 3. Apply Database Migrations (If Any)

```bash
npm run db:migrate
```

Rules:

1. Do not run destructive manual SQL in production
2. Use migration files only
3. Keep soft delete behavior intact

### 4. Deploy Application

Run your platform deploy command for the approved commit.

Examples (replace with your platform command):

```bash
# Example only
# vercel --prod
```

### 5. Post-Deploy Smoke Tests

Run these checks in order:

1. App loads without server errors
2. Facilitator login with PIN works
3. Admin login with email/password works
4. Therapist login with email/password works
5. Facilitator can save a block log
6. Therapist can load pending logs
7. Reports endpoint returns data for known date range
8. No PHI appears in logs or URL paths

### 6. Stabilization Window

For the first 30 minutes after deploy:

1. Monitor error rate
2. Monitor API latency
3. Monitor auth failures
4. Monitor database error logs

If severe error rate increases, execute rollback.

## Rollback Runbook

Trigger rollback if:

1. Login is broken for any role
2. Observation saving fails
3. Data integrity issue is detected
4. Error rate spikes and does not recover quickly

Rollback steps:

1. Pause new deploys
2. Redeploy last known good app version
3. Verify core login and save flows
4. If migration caused issue, apply predefined rollback migration plan
5. Record incident summary and timeline

Important:

1. Never delete production records to recover state
2. Keep audit trail intact
3. Communicate status updates every 10 to 15 minutes during incidents

## PHI and Compliance Checks

Before marking release complete, confirm:

1. No kid names in server logs
2. No kid names in URL paths
3. Redaction path still applies before AI calls (`src/utils/redaction.ts`)
4. Access behavior remains role-scoped
5. Soft delete behavior remains unchanged

## Release Completion Template

Use this in release notes or deployment ticket:

1. Release ID:
2. Commit SHA:
3. Migration(s) applied:
4. Deploy start time:
5. Deploy end time:
6. Smoke test results:
7. Issues found:
8. Rollback used: Yes/No
9. Final status:

## Quick Command Reference

```bash
npm run policy-check
npm run lint
npm run type-check
npm test
npm run build
npm run db:migrate
```

## Ownership

1. Engineering owner: approves release execution
2. Reviewer: confirms checklist and smoke tests
3. Incident owner: runs rollback if needed
