---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: SEO & Booking Conversion
status: planning
last_updated: "2026-05-17T00:00:00.000Z"
last_activity: 2026-05-17
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Current Position

Phase: Not started (roadmap defined, ready to plan Phase 1)
Plan: —
Status: Roadmap created
Last activity: 2026-05-17 — Roadmap defined for v1.0 milestone

## Progress Bar

```
[░░░░░░░░░░░░░░░░░░░░] 0% — 0/5 phases complete
```

## Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 1 | Security & Server Hardening | Not started |
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

### Blockers
- GEO-01: Band must create social/directory profiles before sameAs URLs can be added to schema
- GEO-05: Band must upload YouTube video before VideoObject schema can be written

### Notes
- Content flows through Google Sheet → sync script → src/data/*.js — text changes should go through the sheet, not direct file edits
- Images in public/photos/ must be replaced in-place (WebP replacing JPEG) to avoid server path changes
- prerender.mjs is the source of truth for JSON-LD generation; schema changes go there
