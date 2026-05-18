---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: SEO & Booking Conversion
status: executing
last_updated: "2026-05-18T04:52:42.035Z"
last_activity: 2026-05-17 — Phase 1 planned (1 plan, 2 tasks)
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 1
  completed_plans: 1
  percent: 100
---

# Project State

## Current Position

Phase: 1 — Security & Server Hardening (complete)
Plan: 01-01-PLAN.md (1/1 plans complete)
Status: Phase 1 complete — ready to execute Phase 2
Last activity: 2026-05-17 — Phase 1 executed (2 tasks, SEC-01 through SEC-04 satisfied)

## Progress Bar

```
[████░░░░░░░░░░░░░░░░] 20% — 1/5 phases complete
```

## Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 1 | Security & Server Hardening | Complete |
| 2 | Schema, Technical & Quick Fixes | Not started |
| 3 | Image Performance & CWV | Not started |
| 4 | Content & Booking Conversion | Not started |
| 5 | Entity Authority & GEO | Not started |

## Accumulated Context

### Key Decisions

- Phase 3 (images) depends on Phase 2 being stable to avoid re-touching HTML templates
- Phase 4 (content) depends on Phase 2 so canonical/schema changes don't conflict with new content additions
- Phase 5 (GEO) depends on Phase 4 because llms.txt expansion is most effective after content copy is finalized
- GEO-01 and GEO-05 require manual band action (social profile creation, YouTube upload) before code steps can complete
- [Phase 1] Used 'unsafe-inline' in scriptSrc to allow JSON-LD blocks — no user script paths exist; risk acceptable
- [Phase 1] Rate limiter scoped to /api/contact only — avoids degrading static file requests for legitimate users
- [Phase 1] Inline escapeHtml helper chosen over 'he' package — zero dependencies, correct scope for contact form
- [Phase 1] In-memory rate limit store accepted — resets on dyno restart, acceptable for spam prevention at current scale

### Blockers

- GEO-01: Band must create social/directory profiles before sameAs URLs can be added to schema
- GEO-05: Band must upload YouTube video before VideoObject schema can be written

### Notes

- Content flows through Google Sheet → sync script → src/data/*.js — text changes should go through the sheet, not direct file edits
- Images in public/photos/ must be replaced in-place (WebP replacing JPEG) to avoid server path changes
- prerender.mjs is the source of truth for JSON-LD generation; schema changes go there
