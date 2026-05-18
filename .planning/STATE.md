---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-05-18T00:00:00.000Z"
last_activity: "2026-05-18 — Completed 02-01-PLAN.md — SCHEMA-01 through SCHEMA-04 satisfied"
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 3
  completed_plans: 2
  percent: 40
---

# Project State

## Current Position

Phase: 2 — Schema, Technical & Quick Fixes (in progress)
Plans: 02-01-PLAN.md (Wave 1 — Complete), 02-02-PLAN.md (Wave 2 — Ready)
Status: 02-01 complete — SCHEMA-01 through SCHEMA-04 satisfied
Last activity: 2026-05-18 — Completed 02-01-PLAN.md (SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04)

## Progress Bar

```
[████░░░░░░░░░░░░░░░░] 40% — 1/5 phases complete, 2/3 plans done
```

## Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 1 | Security & Server Hardening | Complete |
| 2 | Schema, Technical & Quick Fixes | In progress (02-01 complete) |
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
- [Phase 2 — 02-01] Used Stubwire embedded JSON-LD price (10.25) as source of truth for Rock-Box Offer block
- [Phase 2 — 02-01] MusicGroup url intentionally left without trailing slash — SCHEMA-03 scope is canonical, og:url, WebSite url only
