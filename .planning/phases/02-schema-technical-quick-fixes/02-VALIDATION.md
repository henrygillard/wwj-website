---
phase: 02
slug: schema-technical-quick-fixes
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-18
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — no jest/vitest/pytest config detected |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && grep-based smoke checks (see below)` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run full grep smoke suite below
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-T1 | 01 | 1 | SCHEMA-01, SCHEMA-02 | — | N/A | smoke | `npm run build && grep "Meanwhile Brewing" dist/index.html` (must return no match) | ❌ W0 | ⬜ pending |
| 02-01-T2 | 01 | 1 | SCHEMA-03, SCHEMA-04 | — | N/A | smoke | `grep -c 'wrestlewithjimmy.com/"' dist/index.html` (expect 3+) | ❌ W0 | ⬜ pending |
| 02-02-T1 | 02 | 2 | PERF-05 | T-02-04 | preload="none" reduces bandwidth on page load | smoke | `grep -r 'preload="none"' src/components/Hero.jsx src/components/VideoSection.jsx \| wc -l` (expect 2) | ❌ W0 | ⬜ pending |
| 02-02-T2 | 02 | 2 | PERF-06, PERF-07 | T-02-03 | favicon is static PNG, no user input | smoke | `grep 'useMemo.*shuffle\|shuffle.*useMemo' src/components/Gallery.jsx && echo FAIL \|\| echo PASS` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No automated test framework — all verification is grep-based smoke tests
- [ ] `npm run build` must pass end-to-end as the minimum gate before any grep checks on `dist/`

*Note: All verification commands are inline in each task's `<verify>` blocks — no separate test file setup needed.*

---

## Full Smoke Suite

Run after all tasks in the wave complete:

```bash
# Build gate
npm run build

# SCHEMA-01: Meanwhile Brewing removed from JSON-LD
grep "Meanwhile Brewing" dist/index.html && echo "FAIL: SCHEMA-01" || echo "PASS: SCHEMA-01"

# SCHEMA-02: Rock-Box Offer has price field
node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); const m=h.match(/Rock-Box[\s\S]{0,500}priceCurrency/); console.log(m?'PASS: SCHEMA-02':'FAIL: SCHEMA-02')"

# SCHEMA-03: trailing slash on canonical, og:url, WebSite url (expect 3+)
grep -c 'wrestlewithjimmy.com/"' dist/index.html

# SCHEMA-04: May 14 removed from llms.txt
grep "May 14" public/llms.txt && echo "FAIL: SCHEMA-04" || echo "PASS: SCHEMA-04"

# PERF-05: preload="none" on both video elements (expect 2)
grep -r 'preload="none"' src/components/Hero.jsx src/components/VideoSection.jsx | wc -l

# PERF-06: shuffle no longer in useMemo
grep 'useMemo.*shuffle\|shuffle.*useMemo' src/components/Gallery.jsx && echo "FAIL: PERF-06" || echo "PASS: PERF-06"

# PERF-07: favicon declared
grep 'rel="icon"' index.html && echo "PASS: PERF-07" || echo "FAIL: PERF-07"
test -s public/favicon.png && echo "PASS: favicon.png exists" || echo "FAIL: favicon.png missing"
```

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Google Rich Results Test shows no past events | SCHEMA-01 | External tool | Paste dist/index.html source into https://search.google.com/test/rich-results |
| Rock-Box Offer price displays correctly | SCHEMA-02 | External tool | Google Rich Results Test — check Event structured data |
| Favicon appears in browser tab | PERF-07 | Visual check | Open site in browser, confirm favicon in tab |
| Gallery does not visibly shift on load | PERF-06 | Visual check | Open site, watch for layout shift; run Lighthouse CLS audit |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify blocks (inline in PLAN.md files)
- [x] Sampling continuity: all 4 tasks have automated verify — no gaps
- [x] Wave 0 covers all verification commands (grep-based, no separate file creation needed)
- [x] No watch-mode flags
- [x] Feedback latency < 30s (`npm run build` ~30s)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
