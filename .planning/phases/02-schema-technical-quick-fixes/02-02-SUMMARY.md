---
phase: "02"
plan: "02"
subsystem: performance
tags: [video-preload, ssr-hydration, favicon, cls, perf]
dependency_graph:
  requires: [02-01]
  provides: [video-preload-none, ssr-stable-gallery, favicon]
  affects: [src/components/Hero.jsx, src/components/VideoSection.jsx, src/components/Gallery.jsx, public/favicon.png, index.html]
tech_stack:
  added: []
  patterns: [useEffect-client-only-shuffle, preload-none-video]
key_files:
  modified:
    - src/components/Hero.jsx
    - src/components/VideoSection.jsx
    - src/components/Gallery.jsx
    - index.html
  created:
    - public/favicon.png
decisions:
  - "Gallery shuffle moved to useEffect (not useState initializer) — initializer also runs server-side, only useEffect is guaranteed client-only"
  - "favicon.png created at 64x64 from logo-black.png via macOS sips — no external tooling required"
  - "preload=none added to Hero.jsx despite autoPlay interaction note — Lighthouse rewards the hint and mobile browsers honor it"
metrics:
  duration: "~8 minutes"
  completed: "2026-05-18"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 5
---

# Phase 02 Plan 02: Performance Quick Fixes Summary

preload="none" on both video elements, Gallery shuffle moved from useMemo (SSR) to useEffect (client-only), and 64x64 favicon.png created and declared in index.html.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add preload=none to Hero.jsx and VideoSection.jsx | 935de50 | src/components/Hero.jsx, src/components/VideoSection.jsx |
| 2 | Gallery useEffect shuffle + favicon creation + index.html declaration | b89d340 | src/components/Gallery.jsx, public/favicon.png, index.html |

## Changes Made

### Task 1 — PERF-05

- Hero.jsx: added `preload="none"` after `playsInline` on the background autoplay video element
- VideoSection.jsx: added `preload="none"` after `controls` and before `className={styles.embed}` on the user-controlled player

### Task 2 — PERF-06 + PERF-07

- Gallery.jsx: replaced `import { useState, useMemo }` with `import { useState, useEffect }`
- Gallery.jsx: replaced `const photos = useMemo(() => shuffle(allPhotos), [])` with `const [photos, setPhotos] = useState(allPhotos)` + `useEffect(() => { setPhotos(shuffle(allPhotos)) }, [])`. SSR now renders stable unshuffled order; client shuffles after hydration, eliminating the hydration-order mismatch CLS.
- public/favicon.png: created 64x64 PNG by running `sips -z 64 64 public/logos/logo-black.png --out public/favicon.png`
- index.html: added `<link rel="icon" type="image/png" href="/favicon.png" />` immediately after the canonical link tag

## Verification Results

| Check | Result | Evidence |
|-------|--------|----------|
| PERF-05: preload=none in Hero.jsx | PASS | grep line 16 confirms prop present |
| PERF-05: preload=none in VideoSection.jsx | PASS | grep line 16 confirms prop present |
| PERF-06: no useMemo shuffle in Gallery.jsx | PASS | grep count = 0 |
| PERF-06: useEffect present in Gallery.jsx | PASS | grep count = 2 (import + usage) |
| PERF-06: useState(allPhotos) in Gallery.jsx | PASS | grep count = 1 |
| PERF-07: favicon.png exists and non-empty | PASS | sips confirms pixelWidth: 64 |
| PERF-07: rel=icon in index.html | PASS | exactly 1 match on line 9 |
| Build | PASS | npm run build exits 0, pre-render complete |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None — changes are static prop additions, a client-side timing fix, and a static PNG file. No new network endpoints, auth paths, or trust boundaries introduced.

## Self-Check: PASSED

- src/components/Hero.jsx modified: confirmed (commit 935de50)
- src/components/VideoSection.jsx modified: confirmed (commit 935de50)
- src/components/Gallery.jsx modified: confirmed (commit b89d340)
- public/favicon.png created: confirmed (commit b89d340, create mode)
- index.html modified: confirmed (commit b89d340)
- Commits 935de50 and b89d340 exist in git log
