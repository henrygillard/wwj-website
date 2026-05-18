---
phase: 01-security-server-hardening
plan: "01"
subsystem: infra
tags: [express, helmet, express-rate-limit, security-headers, rate-limiting, html-escaping, cache-control]

requires: []

provides:
  - Helmet middleware with CSP tuned for Google Fonts and S3 media (SEC-01)
  - express-rate-limit on /api/contact — 10 req/15 min per IP (SEC-02)
  - escapeHtml helper escaping all four contact form fields in HTML email (SEC-03)
  - express.static setHeaders with /assets/ guard for immutable cache (SEC-04)

affects: [all future phases that modify server/index.js]

tech-stack:
  added:
    - helmet@8.1.0
    - express-rate-limit@8.5.2
  patterns:
    - trust proxy=1 must precede all rate-limit middleware on Heroku
    - CSP directives require explicit S3 domain in mediaSrc for video elements
    - safe* variable pattern for HTML email: escape user fields, use raw in text:
    - setHeaders /assets/ guard: filePath.includes('/assets/') before immutable cache

key-files:
  created: []
  modified:
    - server/index.js
    - package.json
    - package-lock.json

key-decisions:
  - "Used 'unsafe-inline' in scriptSrc to allow JSON-LD structured data blocks in pre-rendered HTML — no user-generated script paths exist so XSS risk is acceptable"
  - "Scoped rate limiter to /api/contact only, not globally — avoids rate-limiting static file requests and the SPA fallback for legitimate users"
  - "Inline escapeHtml helper over 'he' package — covers the five dangerous chars, zero dependencies, correct scope for a contact form"
  - "In-memory rate limit store accepted for Phase 1 — resets on dyno restart (acceptable for abuse prevention, not precision billing)"

patterns-established:
  - "Pattern: trust proxy before middleware: app.set('trust proxy', 1) is the first statement after const app = express()"
  - "Pattern: safe* variable naming for HTML templates — raw vars used only in text: field"
  - "Pattern: setHeaders guard — always check filePath.includes('/assets/') before setting immutable cache to protect index.html"

requirements-completed:
  - SEC-01
  - SEC-02
  - SEC-03
  - SEC-04

duration: 12min
completed: 2026-05-17
---

# Phase 1 Plan 01: Security & Server Hardening Summary

**Express server hardened with helmet CSP (Google Fonts + S3), IP-scoped rate limiting on /api/contact, escapeHtml on all four contact form fields, and immutable cache-control for /assets/**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-05-17T00:00:00Z
- **Completed:** 2026-05-17T00:12:00Z
- **Tasks:** 2
- **Files modified:** 3 (server/index.js, package.json, package-lock.json)

## Accomplishments

- Installed helmet@8.1.0 and express-rate-limit@8.5.2 as production dependencies
- Rewrote server/index.js with all four security controls: Helmet CSP, rate limiter, escapeHtml, cache headers
- Verified all four controls with live curl tests — 4/4 security headers, 429 on 11th contact request, 0 raw vars in HTML template, immutable cache-control on /assets/

## Task Commits

1. **Task 1: Install helmet and express-rate-limit** - `6bf510d` (chore)
2. **Task 2: Rewrite server/index.js with all four security controls** - `00df852` (feat)

**Plan metadata:** (docs commit — to follow)

## Files Created/Modified

- `server/index.js` — Rewritten with helmet, rateLimit, escapeHtml, setHeaders cache callback
- `package.json` — Added helmet@8.1.0 and express-rate-limit@8.5.2 to dependencies
- `package-lock.json` — Updated with new packages

## Decisions Made

- Used `'unsafe-inline'` in `scriptSrc` to allow inline `<script type="application/ld+json">` blocks in the pre-rendered HTML. No user-generated script paths exist so the XSS risk is acceptable. If a stricter CSP is needed later, JSON-LD can be moved to a dedicated route served with `application/ld+json` MIME type.
- Scoped rate limiter to `/api/contact` only (not `app.use(limiter)` globally) to avoid degrading legitimate users browsing static pages.
- Chose inline `escapeHtml` helper over the `he` package — covers the five dangerous characters (`&`, `<`, `>`, `"`, `'`), zero additional dependencies, correct scope for a single contact form.
- Accepted in-memory rate limit store — resets on Heroku dyno restart, which is acceptable for spam prevention at current scale.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

Port 3000 was already in use during verification (prior server process). Used PORT=3001 and PORT=3002 for test runs. Not a code issue — all verifications passed.

## Known Stubs

None — no stub values in the modified files.

## Threat Flags

No new security surface introduced beyond what the plan's threat model documents. All STRIDE threats T-01-01 through T-01-08 are mitigated. T-01-09 (IP spoofing via X-Forwarded-For) accepted per plan — `trust proxy=1` trusts exactly one hop.

## Next Phase Readiness

- Phase 1 complete. All four security requirements (SEC-01 through SEC-04) satisfied.
- Phase 2 (Schema, Technical & Quick Fixes) can proceed — no blockers from this phase.
- server/index.js is stable; future schema/HTML changes go in prerender.mjs and src/, not server/index.js.

---
*Phase: 01-security-server-hardening*
*Completed: 2026-05-17*
