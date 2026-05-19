# Requirements: Wrestle With Jimmy Website

**Defined:** 2026-05-17
**Milestone:** v1.0 — SEO & Booking Conversion
**Core Value:** An event booker who lands on the site should immediately understand that Wrestle With Jimmy is the best Weezer cover band available for their event — and feel confident enough to send a booking inquiry.

## v1 Requirements

### Security

- [x] **SEC-01**: Express server sets security headers via Helmet (HSTS, X-Frame-Options, CSP, X-Content-Type-Options, Referrer-Policy)
- [x] **SEC-02**: /api/contact endpoint enforces rate limiting (max 10 requests per 15 minutes per IP)
- [x] **SEC-03**: User-supplied fields (name, email, inquiry, message) are HTML-escaped before insertion into the email template
- [x] **SEC-04**: Hashed JS/CSS assets under /assets/ are served with cache-control: max-age=31536000, immutable

### Schema

- [x] **SCHEMA-01**: The May 14 Meanwhile Brewing event is removed from the JSON-LD ItemList (it is a past event)
- [x] **SCHEMA-02**: The Rock-Box event Offer block includes price and priceCurrency fields
- [x] **SCHEMA-03**: Canonical tag, og:url, WebSite schema url, and sitemap <loc> all use https://wrestlewithjimmy.com/ (trailing slash, consistent)
- [x] **SCHEMA-04**: llms.txt Upcoming Shows section no longer lists the May 14 show

### Performance

- [ ] **PERF-01**: Hero image (hero-1.jpg) is converted to WebP and served under 100KB
- [ ] **PERF-02**: All gallery and about-section images are converted to WebP and served under 120KB each
- [ ] **PERF-03**: Every img element across Gallery.jsx, About.jsx, and Nav.jsx has explicit width and height attributes
- [ ] **PERF-04**: index.html includes a <link rel="preload"> hint for the hero image with fetchpriority="high"
- [x] **PERF-05**: Both video elements (Hero.jsx and VideoSection.jsx) have preload="none"
- [x] **PERF-06**: Gallery photo shuffle runs only in useEffect (client-side) to eliminate SSR/hydration order mismatch
- [x] **PERF-07**: A favicon.png is created and declared in index.html via <link rel="icon">

### Content

- [ ] **CONTENT-01**: The booking/contact section contains at least 150 words addressing event bookers: event types, capacity range, geography, set structure, lead time, and direct email
- [ ] **CONTENT-02**: The testimonials section no longer uses the "Totally real, completely unsponsored" framing; at least 2 slots contain real quotes attributed to actual venues or bookers
- [ ] **CONTENT-03**: The About section names each band member with their instrument
- [ ] **CONTENT-04**: Total indexable homepage word count reaches 600+ words
- [ ] **CONTENT-05**: Footer nav links all 6 sections (About, Gallery, Videos, Shows, Reviews, Book Us)
- [ ] **CONTENT-06**: The "10+ Venues" stat in About reflects the accurate current count from events.js

### GEO / AI Readiness

- [ ] **GEO-01**: sameAs array in MusicGroup JSON-LD is populated with URLs for all created social/directory profiles (no empty array)
- [ ] **GEO-02**: llms.txt What We Play and Where We've Played sections each reach 134+ words with booking-relevant detail
- [ ] **GEO-03**: Sitemap lastmod value is stamped automatically during npm run build (not hardcoded)
- [ ] **GEO-04**: Event JSON-LD is generated dynamically from src/data/events.js during prerender, filtering to upcoming events only
- [ ] **GEO-05**: VideoObject schema is added to index.html pointing to the YouTube video (blocked on YouTube upload — deferred to after manual step)

## v2 Requirements

### Performance

- **PERF-08**: Heroku dyno upgraded to Standard tier or Cloudflare CDN added to eliminate cold-start TTFB
- **PERF-09**: Logo PNGs compressed below 20KB each

### GEO / AI

- **GEO-06**: llms.txt includes a ## Band Members section with named individuals
- **GEO-07**: llms.txt includes a ## Booking Details section with event types, geography, set length
- **GEO-08**: llms.txt declares RSL 1.0 license header

### Schema

- **SCHEMA-05**: MusicGroup logo field updated from bare URL string to ImageObject type

### Discovery

- **DISC-01**: Site submitted to Google Search Console with sitemap (blocked on domain confirmation)
- **DISC-02**: IndexNow configured in sync-and-deploy script for Bing instant indexing
- **DISC-03**: Band listed on Do512, Bandsintown, Songkick, and Spotify artist page

## Out of Scope

| Feature | Reason |
|---|---|
| Blog / news section | No editorial workflow; not needed for a booking site |
| Multi-page routing | SPA with anchors is intentional for this site scale |
| Paid advertising | Outside this milestone's scope |
| Spotify artist page | No original recordings; deferred |
| Google Search Console setup | Blocked on custom domain confirmation |
| Review / AggregateRating schema | Testimonials are satirical; schema is prohibited on non-genuine reviews |
| FAQPage schema | Restricted to gov/healthcare sites; no Google rich result benefit |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| SEC-01 | Phase 1 | Complete ✓ |
| SEC-02 | Phase 1 | Complete ✓ |
| SEC-03 | Phase 1 | Complete ✓ |
| SEC-04 | Phase 1 | Complete ✓ |
| SCHEMA-01 | Phase 2 | Complete |
| SCHEMA-02 | Phase 2 | Complete |
| SCHEMA-03 | Phase 2 | Complete |
| SCHEMA-04 | Phase 2 | Complete |
| PERF-01 | Phase 3 | Pending |
| PERF-02 | Phase 3 | Pending |
| PERF-03 | Phase 3 | Pending |
| PERF-04 | Phase 3 | Pending |
| PERF-05 | Phase 2 | Complete |
| PERF-06 | Phase 2 | Complete |
| PERF-07 | Phase 2 | Complete |
| CONTENT-01 | Phase 4 | Pending |
| CONTENT-02 | Phase 4 | Pending |
| CONTENT-03 | Phase 4 | Pending |
| CONTENT-04 | Phase 4 | Pending |
| CONTENT-05 | Phase 4 | Pending |
| CONTENT-06 | Phase 4 | Pending |
| GEO-01 | Phase 5 | Pending |
| GEO-02 | Phase 5 | Pending |
| GEO-03 | Phase 5 | Pending |
| GEO-04 | Phase 5 | Pending |
| GEO-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-17*
*Last updated: 2026-05-17 after v1.0 milestone start*
