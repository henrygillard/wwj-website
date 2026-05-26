# Roadmap: Wrestle With Jimmy Website

**Milestone:** v1.0 — SEO & Booking Conversion
**Created:** 2026-05-17
**Granularity:** Standard
**Coverage:** 25/25 requirements mapped

## Phases

- [x] **Phase 1: Security & Server Hardening** - Harden the Express server with security headers, rate limiting, input escaping, and correct long-term caching for hashed assets
- [x] **Phase 2: Schema, Technical & Quick Fixes** - Fix all stale/broken structured data, resolve llms.txt accuracy, add video preload, fix gallery CLS, and add favicon (completed 2026-05-18)
- [ ] **Phase 3: Image Performance & CWV** - Compress the entire image library to WebP, add all missing image dimensions, and add the LCP preload hint
- [ ] **Phase 4: Content & Booking Conversion** - Transform the site into a booking-conversion page with expanded copy, real testimonials, band member info, and 600+ word count
- [ ] **Phase 5: Entity Authority & GEO** - Establish Wrestle With Jimmy as a verifiable entity across the web with sameAs schema, expanded llms.txt, automated sitemap, and dynamic event schema

## Phase Details

### Phase 1: Security & Server Hardening
**Goal**: The Express server protects users and the business — security headers are set, rate limiting prevents contact form abuse, user input cannot inject HTML into emails, and build assets are properly cached
**Depends on**: Nothing (first phase)
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04
**Estimated effort**: 1-2 hours
**Key files**: `server/index.js`, `package.json`
**Success Criteria** (what must be TRUE):
  1. A curl request to wrestlewithjimmy.com returns response headers including Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy
  2. Submitting more than 10 contact form requests from the same IP within 15 minutes returns a 429 response
  3. A contact form submission containing `<script>alert(1)</script>` in the name field sends an email with the HTML escaped, not rendered
  4. A request for a hashed asset under /assets/ returns cache-control: max-age=31536000, immutable
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Install helmet + express-rate-limit; rewrite server/index.js with all four security controls (SEC-01 through SEC-04)

### Phase 2: Schema, Technical & Quick Fixes
**Goal**: All structured data is accurate and current, llms.txt matches live show data, videos do not preload, gallery layout is stable on load, and the site has a favicon
**Depends on**: Phase 1
**Requirements**: SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04, PERF-05, PERF-06, PERF-07
**Estimated effort**: 1-2 hours
**Key files**: `scripts/prerender.mjs`, `src/data/events.js`, `public/llms.txt`, `src/components/Hero.jsx`, `src/components/VideoSection.jsx`, `src/components/Gallery.jsx`, `index.html`
**Success Criteria** (what must be TRUE):
  1. Google Rich Results Test shows no past events in the EventScheduled schema — only upcoming shows appear
  2. The Rock-Box event Offer block in the rendered JSON-LD includes a price value and priceCurrency of "USD"
  3. The canonical tag, og:url, and sitemap `<loc>` all resolve to exactly https://wrestlewithjimmy.com/ (with trailing slash)
  4. llms.txt no longer lists the May 14 Meanwhile Brewing show in the Upcoming Shows section
  5. Both video elements have preload="none", gallery photos render in a stable order on first paint, and a favicon appears in the browser tab
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Schema fixes: remove past Meanwhile Brewing event, add Rock-Box price/priceCurrency, add trailing slash to canonical/og:url/WebSite url, remove May 14 from llms.txt (SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04)
- [x] 02-02-PLAN.md — Technical fixes: add preload="none" to both video elements, move Gallery shuffle to useEffect, create favicon.png and declare in index.html (PERF-05, PERF-06, PERF-07)

### Phase 3: Image Performance & CWV
**Goal**: Every image on the site is a compressed WebP file that loads fast, and every img element has explicit dimensions so layout never shifts during page load
**Depends on**: Phase 2
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04
**Estimated effort**: 4-6 hours
**Key files**: `public/photos/` (all images), `src/components/Gallery.jsx`, `src/components/About.jsx`, `src/components/Nav.jsx`, `src/components/Hero.jsx`, `index.html`
**Success Criteria** (what must be TRUE):
  1. The hero image file is a WebP under 100KB and Lighthouse reports the LCP image loads with no render-blocking delay
  2. All 32+ gallery and about-section images are WebP files under 120KB each (verified by file size scan)
  3. Lighthouse CLS score is 0 or near-0 — no layout shift is triggered by image load across Gallery, About, or Nav
  4. index.html contains a `<link rel="preload">` for the hero image with fetchpriority="high"
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Install sharp, write verify-images.mjs scaffold and convert-images.mjs; convert all 35 JPEGs to WebP with resize; update photos.js with .webp paths and width/height fields; delete originals (PERF-01, PERF-02)
- [x] 03-02-PLAN.md — Patch Gallery.jsx, About.jsx, Nav.jsx img attrs; update Hero.jsx/VideoSection.jsx poster paths; update About.module.css background path; add LCP preload + update 3 og/schema paths in index.html; patch sync-from-sheet.mjs (PERF-03, PERF-04)

### Phase 4: Content & Booking Conversion
**Goal**: An event booker landing on the site finds a credible, complete booking page — with detailed booking copy, real venue testimonials, named band members, accurate stats, and complete navigation
**Depends on**: Phase 2
**Requirements**: CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06
**Estimated effort**: 2-4 hours
**Key files**: Google Sheet (content source), `src/data/booking.js`, `src/data/testimonials.js`, `src/data/about.js`, `src/components/Booking.jsx`, `src/components/Testimonials.jsx`, `src/components/About.jsx`, `src/components/Footer.jsx`
**Success Criteria** (what must be TRUE):
  1. The booking/contact section contains 150+ words covering event types, capacity, geography, set structure, lead time, and direct email — readable without scrolling past the section
  2. The testimonials section shows at least 2 quotes attributed to real venues or bookers, with no "Totally real, completely unsponsored" framing visible
  3. The About section names each band member alongside their instrument
  4. A word count tool reports 600+ indexable words on the rendered homepage
  5. The footer nav links all 6 sections (About, Gallery, Videos, Shows, Reviews, Book Us) and the "10+ Venues" stat in About reflects the accurate count from events.js
**Plans**: 1 plan (CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-06 deferred per user decision in 04-CONTEXT.md)
**UI hint**: yes

Plans:
- [x] 04-01-PLAN.md — Add Videos, Shows, Reviews anchor links to Footer.jsx nav; final 6-link order: About, Gallery, Videos, Shows, Reviews, Book Us (CONTENT-05)

### Phase 5: Entity Authority & GEO
**Goal**: Wrestle With Jimmy is a verifiable, well-described entity that AI systems and search engines can confidently cite — with real social profile links in schema, expanded llms.txt passages, an automated sitemap, and event schema that never drifts from the data
**Depends on**: Phase 4
**Requirements**: GEO-01, GEO-02, GEO-03, GEO-04, GEO-05
**Estimated effort**: 2-4 hours code + external manual steps
**Key files**: `scripts/prerender.mjs`, `public/llms.txt`, `scripts/generate-sitemap.mjs` (or equivalent), `src/data/events.js`, `index.html`
**Dependencies and blockers**:
  - GEO-01 (sameAs URLs): blocked on manual creation of social/directory profiles by the band before URLs can be added to schema
  - GEO-05 (VideoObject schema): blocked on YouTube video upload by the band; schema cannot be written without a real video URL
**Success Criteria** (what must be TRUE):
  1. The MusicGroup JSON-LD sameAs array contains at least 2 real, live URLs to social or directory profiles for the band
  2. The llms.txt What We Play and Where We've Played sections each contain 134+ words of booking-relevant detail (verified by word count)
  3. Running `npm run build` produces a sitemap.xml where the `<lastmod>` value matches the build date — not a hardcoded date
  4. The rendered JSON-LD includes only upcoming events, dynamically sourced from events.js, with no manual sync required
  5. (Deferred — blocked on YouTube) VideoObject schema is present in index.html once the YouTube video URL is available
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Security & Server Hardening | 1/1 | Complete | 2026-05-17 |
| 2. Schema, Technical & Quick Fixes | 2/2 | Complete   | 2026-05-18 |
| 3. Image Performance & CWV | 0/2 | Not started | - |
| 4. Content & Booking Conversion | 0/1 | Not started | - |
| 5. Entity Authority & GEO | 0/? | Not started | - |

---
*Roadmap created: 2026-05-17*
*Last updated: 2026-05-19 — Phase 4 plan created (04-01); CONTENT-01 through CONTENT-04 and CONTENT-06 deferred per user decision*
