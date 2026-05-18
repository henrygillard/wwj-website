---
phase: "02"
plan: "01"
subsystem: schema
tags: [json-ld, structured-data, seo, schema-org, llms-txt]
dependency_graph:
  requires: []
  provides: [clean-itemlist-schema, trailing-slash-urls, accurate-llms-txt]
  affects: [index.html, public/llms.txt]
tech_stack:
  added: []
  patterns: [json-ld-schema, schema-org-event, schema-org-offer]
key_files:
  modified:
    - index.html
    - public/llms.txt
decisions:
  - "Used Stubwire embedded JSON-LD price value (10.25) rather than displayed door price (14.75) as source of truth for Offer block"
  - "MusicGroup url field intentionally left without trailing slash — SCHEMA-03 scope limited to canonical, og:url, and WebSite schema url only"
  - "Meanwhile Brewing correctly appears in React-rendered Past Shows body section (driven by events.js upcoming:false) — this is distinct from the JSON-LD ItemList which is now clean"
metrics:
  duration: "~10 minutes"
  completed: "2026-05-18"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 2
---

# Phase 02 Plan 01: Schema & Data-Accuracy Quick Fixes Summary

JSON-LD ItemList corrected to single Rock-Box event with full Offer pricing, canonical/og:url/WebSite URLs updated with trailing slash, and llms.txt Upcoming Shows purged of past Meanwhile Brewing entry.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Remove Meanwhile Brewing from ItemList, add Rock-Box price | 0bdaf87 | index.html |
| 2 | Add trailing slash to canonical/og:url/WebSite; remove May 14 from llms.txt | 7cb48b5 | index.html, public/llms.txt |

## Changes Made

### Task 1 — SCHEMA-01 + SCHEMA-02 (index.html ItemList)

- Removed the Meanwhile Brewing Company event entirely from the JSON-LD ItemList (it was `upcoming: false` in events.js)
- Rock-Box event renumbered from position 2 to position 1 as the sole upcoming event
- Added `"price": "10.25"` and `"priceCurrency": "USD"` to the Rock-Box Offer block (price sourced from Stubwire's own embedded JSON-LD)
- `"startDate": "2026-05-14"` no longer appears anywhere in index.html

### Task 2 — SCHEMA-03 + SCHEMA-04 (index.html + public/llms.txt)

- `<link rel="canonical" href="https://wrestlewithjimmy.com/">` — trailing slash added
- `<meta property="og:url" content="https://wrestlewithjimmy.com/">` — trailing slash added
- WebSite schema `"url": "https://wrestlewithjimmy.com/"` — trailing slash added
- MusicGroup `"url"` field unchanged (out of scope per SCHEMA-03)
- Deleted May 14 Meanwhile Brewing line from `## Upcoming Shows` in llms.txt

## Verification Results

| Check | Result | Evidence |
|-------|--------|----------|
| SCHEMA-01: Meanwhile Brewing absent from JSON-LD | PASS | 0 matches in JSON-LD blocks; Python parse of built HTML confirms ItemList has only Rock-Box |
| SCHEMA-02: price field in Rock-Box Offer | PASS | `"price": "10.25"` and `"priceCurrency": "USD"` present |
| SCHEMA-03: 3 trailing-slash URLs in index.html | PASS | `grep -c 'wrestlewithjimmy\.com/"' index.html` returns 3 |
| SCHEMA-04: May 14 absent from llms.txt | PASS | Zero matches; Rock-Box May 23 line intact |
| Build | PASS | `npm run build` exits 0, pre-render complete |

## Deviations from Plan

None — plan executed exactly as written. The Meanwhile Brewing string visible in `dist/index.html` grep output is in the React-rendered Past Shows body section (correct behavior, driven by `events.js`), not in the JSON-LD blocks.

## Known Stubs

None.

## Threat Flags

None — changes are limited to static content edits (JSON-LD text and llms.txt). No new network endpoints, auth paths, or trust boundaries introduced.

## Self-Check: PASSED

- index.html modified: confirmed (2 commits reference it)
- public/llms.txt modified: confirmed (commit 7cb48b5)
- Commits 0bdaf87 and 7cb48b5 exist in git log
- All 4 SCHEMA requirements verified passing
