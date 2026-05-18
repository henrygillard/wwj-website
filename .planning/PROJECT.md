# Wrestle With Jimmy — Website

## What This Is

The official website for Wrestle With Jimmy, Austin's Weezer cover band. It is a single-page React + Vite app with SSR pre-rendering, hosted on Heroku, with content managed via Google Sheets. The primary purpose is to convert event bookers (venues, festivals, corporate events, private parties) who find the site into booking inquiries.

## Core Value

An event booker who lands on the site should immediately understand that Wrestle With Jimmy is the best Weezer cover band available for their event — and feel confident enough to send a booking inquiry.

## Current Milestone: v1.0 — SEO & Booking Conversion

**Goal:** Fix all ACTION-PLAN.md audit items to make wrestlewithjimmy.com the go-to booking destination for event bookers searching for a Weezer cover band in Austin.

**Target features:**
- Security hardening (Helmet, rate limiting, input escaping)
- Image compression and Core Web Vitals fixes
- Schema correctness and AI readiness (llms.txt, sameAs)
- Booking-conversion content (expanded copy, real testimonials, band info)
- Entity authority setup (social profiles, YouTube, sameAs)

## Requirements

### Validated

(None yet — this is the first milestone)

### Active

- [x] SEC-01: Express server has security headers via Helmet
- [x] SEC-02: /api/contact endpoint has rate limiting
- [x] SEC-03: Contact form email HTML injection is patched
- [x] SEC-04: Hashed JS/CSS assets served with long-term immutable cache headers
- [ ] SCHEMA-01: Stale past event removed from JSON-LD EventScheduled schema
- [ ] SCHEMA-02: Rock-Box event Offer includes price and priceCurrency
- [ ] SCHEMA-03: Canonical URL, og:url, and sitemap loc use consistent trailing slash
- [ ] SCHEMA-04: llms.txt updated — stale May 14 show removed from Upcoming Shows
- [ ] PERF-01: Hero image compressed to WebP, under 100KB
- [ ] PERF-02: All 32+ gallery images compressed to WebP, under 120KB each
- [ ] PERF-03: All img elements have width and height attributes (CLS fix)
- [ ] PERF-04: LCP preload hint added for hero image
- [ ] PERF-05: Both video elements have preload="none"
- [ ] PERF-06: Gallery shuffle moved to useEffect to fix SSR hydration CLS
- [ ] PERF-07: Favicon added to index.html
- [ ] CONTENT-01: Booking section expanded with ~150 words targeting event bookers
- [ ] CONTENT-02: Testimonials section reframed — real venue quotes added, fake review framing removed
- [ ] CONTENT-03: Band member names and instruments added to About section
- [ ] CONTENT-04: Total homepage word count reaches 600+
- [ ] CONTENT-05: Footer nav updated to include all 6 sections
- [ ] CONTENT-06: "10+ Venues" stat updated to accurate count
- [ ] GEO-01: sameAs array in MusicGroup schema populated with real profile URLs
- [ ] GEO-02: llms.txt passages expanded to 134+ words per section
- [ ] GEO-03: Sitemap lastmod automated to update on every deploy
- [ ] GEO-04: Dynamic event schema generated from events.js (no manual sync drift)
- [ ] GEO-05: VideoObject schema added after YouTube upload

### Out of Scope

- Blog or news section — no editorial workflow exists, not needed for a booking site
- Multi-page routing / separate URL per section — SPA with anchors is intentional
- Paid advertising / Google Ads — out of scope for this milestone
- Spotify artist page — no original recordings exist yet
- Google Search Console setup — blocked until custom domain fully confirmed; tracked in SEO-TODO.md Step 7

## Context

- **Stack:** React 18 + Vite, Express (Heroku), SSR pre-rendering via `scripts/prerender.mjs`
- **Content management:** Google Sheets → `npm run sync-content` updates `src/data/*.js` files
- **Deploy:** `npm run sync-and-deploy` syncs content, commits, and pushes to Heroku
- **Previous audit:** SEO-TODO.md (2026-04-06) — Steps 1 (pre-rendering) and H1 partial fix already done
- **Full audit:** FULL-AUDIT-REPORT.md (2026-05-17) — comprehensive findings across 7 categories
- **Action plan:** ACTION-PLAN.md (2026-05-17) — prioritized fixes with effort estimates
- **Business goal (per owner):** Position WWJ as the best Weezer cover band for event bookers

## Constraints

- **Platform:** Heroku Express — no Vercel, no edge functions. Server changes go in `server/index.js`
- **Content:** Text content flows through Google Sheet + sync script, not direct file edits
- **Images:** Stored in `public/photos/` — must replace JPEGs with WebP in-place for server compatibility
- **External steps:** YouTube channel and social profile creation require manual action by the band; GEO-01 and GEO-05 are blocked on these

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| SSR pre-rendering over full CSR SPA | Crawlability without JS for SEO/AI bots | ✓ Good |
| Single-page app with anchor navigation | Band site has simple enough structure; multi-page adds overhead with no SEO benefit | — Pending |
| Google Sheets as CMS | Non-technical content updates without code changes | ✓ Good |
| Heroku over Vercel | Existing deployment, not worth migrating for this milestone | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-17 after v1.0 milestone start*
