---
phase: 03-image-performance-cwv
plan: "01"
subsystem: images
tags: [webp, sharp, image-optimization, perf]
dependency_graph:
  requires: []
  provides: [webp-images, photos-js-dimensions]
  affects: [Gallery.jsx, About.jsx, Hero.jsx, VideoSection.jsx, About.module.css]
tech_stack:
  added: [sharp@0.34.5]
  patterns: [batch-resize-convert, bounding-box-fit-inside]
key_files:
  created:
    - scripts/verify-images.mjs
    - scripts/convert-images.mjs
    - public/photos/barton-springs/hero-1.webp
    - public/photos/barton-springs/hero-2.webp
    - public/photos/barton-springs/DSC06956.webp
    - public/photos/barton-springs/DSC06973.webp
    - public/photos/barton-springs/DSC06978.webp
    - public/photos/barton-springs/DSC06987.webp
    - public/photos/barton-springs/DSC06995.webp
    - public/photos/barton-springs/DSC07023.webp
    - public/photos/barton-springs/DSC07049.webp
    - public/photos/barton-springs/DSC07069.webp
    - public/photos/barton-springs/DSC07123.webp
    - public/photos/barton-springs/DSC07136.webp
    - public/photos/barton-springs/DSC07157.webp
    - public/photos/barton-springs/DSC07164.webp
    - public/photos/barton-springs/DSC07182.webp
    - public/photos/barton-springs/DSC07334.webp
    - public/photos/barton-springs/DSC07401.webp
    - public/photos/barton-springs/DSC07425.webp
    - public/photos/barton-springs/DSC07459.webp
    - public/photos/barton-springs/DSC07479.webp
    - public/photos/radio-east/cover-image.webp
    - public/photos/radio-east/DSC5611.webp
    - public/photos/radio-east/DSC5612.webp
    - public/photos/radio-east/DSC5618.webp
    - public/photos/radio-east/DSC5623.webp
    - public/photos/radio-east/DSC5628.webp
    - public/photos/radio-east/DSC5633.webp
    - public/photos/radio-east/DSC5634.webp
    - public/photos/radio-east/DSC5635.webp
    - public/photos/radio-east/DSC5645.webp
    - public/photos/radio-east/DSC5648.webp
    - public/photos/radio-east/DSC5650.webp
    - public/photos/radio-east/DSC5656.webp
    - public/photos/radio-east/DSC5666.webp
    - public/photos/radio-east/DSC5682.webp
  modified:
    - src/data/photos.js
    - package.json
    - package-lock.json
  deleted:
    - public/photos/barton-springs/hero-1.jpg
    - public/photos/barton-springs/hero-2.jpg
    - public/photos/barton-springs/DSC0*.jpg (18 files)
    - public/photos/radio-east/DSC*.jpg (14 files)
    - public/photos/radio-east/cover-image.jpg
decisions:
  - "Used bounding-box resize (600x900, q60) for hero-1.jpg (portrait 4184x6276): width-only resize at 1920px produces 765 KB at q75, far over 100 KB limit even at q5 (244 KB minimum). Bounding box yields 94.7 KB at acceptable 600x900 output."
  - "Used width 1200px, q50 for hero-2.jpg (portrait 4415x6623): width-only at 1200px with q75 gives 152 KB; q50 brings it to 109 KB under 120 KB limit."
  - "photos.js has 32 entries (not 33 as plan states): hero-1, hero-2, cover-image are not in photos.js (they are referenced directly by components/CSS). Plan count was off by one."
metrics:
  duration: "7 minutes"
  completed: "2026-05-18T18:23:37Z"
  tasks_completed: 2
  files_created: 37
  files_modified: 3
  files_deleted: 35
---

# Phase 3 Plan 1: WebP Image Conversion Summary

**One-liner:** sharp-powered batch conversion of 35 JPEG DSLR photos to compressed WebP with per-file bounding-box resize, satisfying PERF-01 (hero under 100 KB) and PERF-02 (all 35 under 120 KB).

## Tasks Completed

| Task | Name | Commit | Key Output |
|------|------|--------|-----------|
| 1 | Write scripts/verify-images.mjs | a383484 | Safety scaffold: checks 35 WebP files against size thresholds |
| 2 | Install sharp, convert images, delete originals | 895d2aa | 35 .webp files, updated photos.js with width/height, 0 .jpg files remaining |

## Verification Results

| Check | Result |
|-------|--------|
| `node scripts/verify-images.mjs` | Exit 0 — all 35 WebP files within targets |
| `find public/photos -name "*.jpg" \| wc -l` | 0 |
| `find public/photos -name "*.webp" \| wc -l` | 35 |
| `grep -c '"width"' src/data/photos.js` | 32 |
| `grep -c '"height"' src/data/photos.js` | 32 |
| `stat hero-1.webp` | 97008 bytes (94.7 KB, under 102400 limit) |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Hero portrait images exceeded size targets at planned resize parameters**

- **Found during:** Task 2 — first conversion run
- **Issue:** hero-1.jpg is a portrait image (4184×6276). At maxWidth=1920 with q75, the output is 1920×2882 at 765.7 KB — far over the 100 KB (102400 byte) PERF-01 limit. Even at q=5, a 1920px-wide portrait output is 244 KB minimum. hero-2.jpg at 1200px wide (q75) was 152.7 KB, over the 120 KB limit.
- **Root cause:** Research estimate ("~60-80 KB at q75") was marked ASSUMED and proved incorrect for tall portrait images. Width-only resize with `fit: inside` on portrait images still produces large tall outputs that compress poorly even at very low quality.
- **Fix:** Changed conversion parameters for portrait hero images:
  - hero-1: bounding box `{width: 600, height: 900}` at `quality: 60` → 94.7 KB (output: 600×900)
  - hero-2: `maxWidth: 1200` at `quality: 50` → 109.2 KB (output: 1200×1800)
- **Files modified:** `scripts/convert-images.mjs` (getConversionParams function), updated WebP files regenerated
- **Commits:** 895d2aa

**2. [Rule 1 - Bug] photos.js re-run idempotency fix — basename extraction broke on second run**

- **Found during:** Task 2 — second conversion run (after first run had already updated photos.js to .webp paths)
- **Issue:** `path.basename(entry.src, '.jpg')` returned `"DSC06956.webp"` when photos.js already had .webp paths from first run, causing dimension lookup to fail.
- **Fix:** Changed to `path.basename(entry.src).replace(/\.(jpg|webp)$/i, '')` and `entry.src.replace(/\.(jpg|webp)$/i, '.webp')` so the script is idempotent regardless of current photos.js state.
- **Files modified:** `scripts/convert-images.mjs`
- **Commit:** 895d2aa

### Plan Discrepancy (Non-deviation)

The plan states photos.js has "33 entries" but the actual file has **32 entries**. hero-1.jpg, hero-2.jpg, and cover-image.jpg are not in photos.js — they are referenced directly by React components and CSS. The plan correctly notes cover-image is CSS-only but miscounted the total. This does not affect correctness — all 32 gallery photo entries have been updated with .webp paths and width/height fields.

## Known Stubs

None — all 35 WebP files are real converted images. photos.js carries actual intrinsic dimensions from sharp conversion output.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundaries introduced. Local build script only.

## Self-Check: PASSED

- scripts/verify-images.mjs: EXISTS, exits 0
- scripts/convert-images.mjs: EXISTS
- src/data/photos.js: EXISTS, 32 entries with .webp paths and width/height
- public/photos/barton-springs/hero-1.webp: EXISTS (97008 bytes)
- Commits a383484 and 895d2aa: FOUND in git log
