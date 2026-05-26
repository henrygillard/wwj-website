---
phase: 3
slug: image-performance-cwv
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-18
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected — no jest/vitest/test directory present |
| **Config file** | None — Wave 0 creates verify-images.mjs |
| **Quick run command** | `node scripts/verify-images.mjs` |
| **Full suite command** | `node scripts/verify-images.mjs` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** `find public/photos -name "*.webp" | wc -l` (count check)
- **After every plan wave:** Run `node scripts/verify-images.mjs` (full size scan)
- **Before `/gsd-verify-work`:** verify-images.mjs passes + grep confirms preload hint present
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | PERF-01, PERF-02 | Static file only — N/A | smoke | `node scripts/verify-images.mjs` (exits 1 until Task 2 runs) | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 1 | PERF-01, PERF-02 | N/A | smoke | `node scripts/verify-images.mjs && find public/photos -name "*.jpg" \| wc -l` | ❌ W0 | ⬜ pending |
| 3-02-01 | 02 | 2 | PERF-03 | N/A | smoke | `grep -n 'photo\.width' src/components/Gallery.jsx && grep -c 'width={110}' src/components/Nav.jsx` | N/A | ⬜ pending |
| 3-02-02 | 02 | 2 | PERF-04 | N/A | smoke | `test $(grep -c 'hero-1\.jpg' index.html) -eq 0 && grep -c 'fetchpriority="high"' index.html` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/verify-images.mjs` — verifies all 35 .webp files exist and are under size targets (PERF-01: hero <100 KB, PERF-02: all others <120 KB)
- [ ] `npm install --save-dev sharp` — install before conversion script can run

*Must be completed in Wave 1 before conversion task executes.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All `<img>` in Gallery/About/Nav have width+height | PERF-03 | Attribute presence in JSX is checkable by grep | `grep -r 'width=' src/components/Gallery.jsx src/components/About.jsx src/components/Nav.jsx` |
| Lighthouse CLS score is 0 or near-0 | PERF-03 | Requires browser render | Run Lighthouse on local build; check CLS metric |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (verify-images.mjs created in Plan 01 Task 1 before conversion runs)
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-05-18
