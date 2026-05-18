---
phase: 03-image-performance-cwv
plan: "02"
subsystem: components
tags: [webp, cls, lcp, img-dimensions, preload]
dependency_graph:
  requires: [03-01]
  provides: [img-dimensions, lcp-preload, zero-jpg-refs]
  affects: [Gallery.jsx, About.jsx, Nav.jsx, Hero.jsx, VideoSection.jsx, About.module.css, index.html, sync-from-sheet.mjs]
tech_stack:
  added: []
  patterns: [explicit-img-dimensions, lcp-preload-hint, webp-normalisation-guard]
key_files:
  created: []
  modified:
    - src/components/Gallery.jsx
    - src/components/About.jsx
    - src/components/Nav.jsx
    - src/components/Hero.jsx
    - src/components/VideoSection.jsx
    - src/components/About.module.css
    - scripts/sync-from-sheet.mjs
    - index.html
decisions:
  - "About.jsx hero-1.webp dimensions set to 600x900 (actual sharp output from 03-01), hero-2.webp set to 1200x1800 — authoritative values from 03-01-SUMMARY.md, not estimated"
  - "LCP preload inserted immediately after canonical link (line 8) with no imagesrcset and no type attribute, matching poster path exactly"
  - "sync-from-sheet.mjs normalisation uses replace(/\\.jpg$/i, '.webp') — idempotent on paths already ending in .webp"
metrics:
  duration: "19 minutes"
  completed: "2026-05-18T18:51:06Z"
  tasks_completed: 2
  files_created: 0
  files_modified: 8
  files_deleted: 0
---

# Phase 3 Plan 2: Component Patching & LCP Preload Summary

**One-liner:** Patched all 8 source files to add explicit img width/height attrs, replace every .jpg reference with .webp, and insert an LCP preload hint in index.html — satisfying PERF-03 (CLS fix) and PERF-04 (LCP hint).

## Tasks Completed

| Task | Name | Commit | Key Output |
|------|------|--------|-----------|
| 1 | Patch Gallery.jsx, About.jsx, Nav.jsx, About.module.css, sync-from-sheet.mjs | 0920a07 | img dimensions added; .jpg refs → .webp; sync script normalisation guard |
| 2 | Patch Hero.jsx, VideoSection.jsx, index.html — poster paths and LCP preload | 67a753f | video poster → .webp; LCP preload inserted; og/twitter/schema image → .webp |

## Verification Results

| Check | Result |
|-------|--------|
| `node scripts/verify-images.mjs` | Exit 0 — all 35 WebP files within targets |
| `grep -c 'hero-1.jpg' index.html` | 0 |
| `grep -c 'fetchpriority="high"' index.html` | 1 |
| `grep -r 'photo.width' Gallery.jsx` | Match on line 36 |
| `.jpg refs in About.jsx, Hero.jsx, VideoSection.jsx, About.module.css` | 0 matches |
| `grep -c 'width={110}' Nav.jsx` | 1 |
| `grep -c 'replace.*\.jpg' sync-from-sheet.mjs` | 1 |

## Deviations from Plan

None — plan executed exactly as written. All edits matched the interface patterns specified in the plan context. Dimensions for About.jsx hero images (600x900, 1200x1800) were taken directly from the 03-01-SUMMARY.md conversion output as required.

## Known Stubs

None — all img elements carry real intrinsic dimensions from actual WebP conversion output. The preload href exactly matches the poster path in Hero.jsx and VideoSection.jsx.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundaries introduced. Changes are static HTML head metadata and JSX attribute additions only.

## Self-Check: PASSED

- src/components/Gallery.jsx: width={photo.width} height={photo.height} on img line 36
- src/components/About.jsx: hero1/hero2 consts use .webp; both imgs have width/height (600x900, 1200x1800)
- src/components/Nav.jsx: logo img has width={110} height={110}
- src/components/Hero.jsx: poster="/photos/barton-springs/hero-1.webp"
- src/components/VideoSection.jsx: poster="/photos/barton-springs/hero-1.webp"
- src/components/About.module.css: url('/photos/radio-east/cover-image.webp')
- scripts/sync-from-sheet.mjs: row[0].replace(/\.jpg$/i, '.webp') on photoItems push
- index.html: preload link with fetchpriority="high" after canonical; og:image, twitter:image, MusicGroup image all reference hero-1.webp
- Commits 0920a07 and 67a753f: FOUND in git log
