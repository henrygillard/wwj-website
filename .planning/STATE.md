---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: SEO & Booking Conversion
status: executing
last_updated: "2026-05-18T00:00:00.000Z"
last_activity: 2026-05-18 — Phase 2 planned (2 plans, 4 tasks)
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 3
  completed_plans: 1
  percent: 20
---

# Project State

## Current Position

Phase: 2 — Schema, Technical & Quick Fixes (ready to execute)
Plans: 02-01-PLAN.md (Wave 1), 02-02-PLAN.md (Wave 2)
Status: Phase 2 planned — ready to execute
Last activity: 2026-05-18 — Phase 2 planned (2 plans, 4 tasks: SCHEMA-01 through SCHEMA-04, PERF-05 through PERF-07)

## Progress Bar

```
[████░░░░░░░░░░░░░░░░] 20% — 1/5 phases complete
```

## Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 1 | Security & Server Hardening | Complete |
| 2 | Schema, Technical & Quick Fixes | Ready to execute |
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
- prerender.mjs only injects SSR body HTML — it does NOT generate JSON-LD; for Phase 2, schema changes go directly in index.html (dynamic generation deferred to Phase 5 / GEO-04)
- [Phase 2] JSON-LD is hardcoded in index.html head; sitemap.xml already had the trailing slash
- [Phase 2] Rock-Box ticket price must be looked up from Stubwire URL before writing SCHEMA-02 edit
