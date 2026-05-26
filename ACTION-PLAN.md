# SEO Action Plan — wrestlewithjimmy.com

**Audit Date:** 2026-05-17
**Goal:** Establish wrestlewithjimmy.com as the go-to destination for event bookers searching for a Weezer cover band or Austin cover band for hire. Every item below is ordered by its impact on that conversion goal.

---

## CRITICAL — Fix Today (Total: ~2 hours)

These either block rich result eligibility, create legal/security exposure, or actively mislead visitors right now.

### C1 — Remove stale event from JSON-LD schema (5 min)

**File:** `index.html`

The May 14 event (Meanwhile Brewing) is 3 days in the past but the schema shows `"eventStatus": "https://schema.org/EventScheduled"`. Google can issue a manual action against event markup for this. Remove the May 14 block from the `ItemList` entirely. Also add `price` and `priceCurrency` to the May 23 Rock-Box `Offer`.

Corrected schema is in FULL-AUDIT-REPORT.md section 4.3.

### C2 — Fix stale llms.txt (5 min)

**File:** `public/llms.txt`

The May 14 show is listed as "Upcoming." AI models are surfacing this as a live event to users asking about upcoming Austin shows. Remove it from the Upcoming Shows section now.

### C3 — Add security headers via Helmet (30 min)

**File:** `server/index.js`

```bash
npm install helmet express-rate-limit
```

```js
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

app.use(helmet())
app.post('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), ...)
```

Also add input escaping in the HTML email template to prevent HTML injection.

### C4 — Fix asset caching (15 min)

**File:** `server/index.js`

Split `express.static` into two rules — hashed `/assets/*` get `max-age: 1y, immutable`. Everything else gets `max-age: 5m`. This alone eliminates re-downloading the JS/CSS bundle on every page load for return visitors. See FULL-AUDIT-REPORT.md section 1.4 for exact code.

### C5 — Add `preload="none"` to both video elements (5 min)

**Files:** `src/components/Hero.jsx`, `src/components/VideoSection.jsx`

The background video and the recap video both fetch from S3 on page load with no preload directive. Add `preload="none"` to both `<video>` tags. This is the fastest available LCP improvement and takes 2 minutes.

---

## HIGH — Fix This Week (Total: ~6–8 hours)

These are the changes that will move the needle on booking conversion and search rankings.

### H1 — Expand the booking section copy (2 hours) — HIGHEST BOOKING IMPACT

**File:** `src/data/content.js` (update via Google Sheet + sync)

The Contact section has one sentence and a form. A professional booker needs more before they'll commit to sending an inquiry. Add approximately 150 words covering:

- **What type of events:** venues, breweries, festivals, corporate events, private parties, backyard shows
- **Capacity range:** e.g., "We play everything from 50-person brewery nights to 1,000+ festival stages"
- **Geography:** "Based in Austin, TX — available across Central Texas and willing to travel for the right show"
- **Set structure:** "We play 45–60 minute sets; multi-set bookings available"
- **Lead time:** "We typically book 4–8 weeks out; last-minute inquiries welcome"
- **Direct email fallback:** `wrestlewithjimmyatx@gmail.com`
- **Backline/tech rider:** brief note on what you need from the venue

This copy should be written as a pitch to a booker, not a fan. The booking section is where the sale closes.

### H2 — Reframe the testimonials section (1 hour) — TRUST SIGNAL

**File:** `src/data/content.js` (update via Google Sheet + sync)

Replace at least 2–3 of the satirical reviews with real quotes from actual bookers or venue contacts. Even brief quotes attributed to real venues ("Great energy — the crowd went wild" — Central Machine Works) convert better than the best satirical review. Keep the humor for the remaining slots if desired, but rename the section and remove the "Totally real, completely unsponsored" framing.

### H3 — Compress all images to WebP (3–4 hours) — LARGEST LCP GAIN

**Directory:** `public/photos/`

The hero image alone is 7MB. All 32 gallery images total 139MB of uncompressed JPEGs. No visitor should be downloading files this large. Process:

```bash
# Install cwebp or use sharp/imagemin
# Target: hero-1.jpg → hero-1.webp at 1920px wide, ~80KB
# Gallery images → 1200px wide, 80–120KB each
# Logo PNGs → under 20KB
```

Add `<link rel="preload" as="image" href="/photos/barton-springs/hero-1.webp" fetchpriority="high">` in `index.html` after converting.

Update Gallery.jsx to serve WebP with JPEG fallback via `<picture>`.

### H4 — Add width/height to all `<img>` tags (1 hour) — CLS FIX

**Files:** `src/components/Gallery.jsx`, `src/components/About.jsx`, `src/components/Nav.jsx`

Every `<img>` is missing explicit dimensions. This causes layout shift as images load. Either add `width` and `height` attributes matching the display size, or add `aspect-ratio: 3/2; object-fit: cover` in the CSS modules.

### H5 — Add band member section (30 min) — E-E-A-T + BOOKING TRUST

**File:** `src/data/content.js` (or new section in About)

A booker hiring a live act wants to know who they are getting. Add first names and instruments for each member. This also makes the band citable by AI models when asked "who are the members of Wrestle With Jimmy."

### H6 — Add favicon (15 min)

**File:** `index.html`, `public/`

Create a 32×32 PNG from the logo mark and add:
```html
<link rel="icon" href="/favicon.png" type="image/png">
```
A missing favicon looks unprofessional in browser tabs and Google SERP results — both places where a booker is evaluating the band.

### H7 — Expand content to 600+ words (integrate with H1, H2, H5)

When the above content changes are made, the total word count should reach 600+. The About section should include band backstory (when founded, how the name came about), set description (what a WWJ show actually feels like), and venue context (what it was like to play Brisketfest, what the crowd at Mohawk was like). This is not just SEO — it sells the experience to a booker reading the page.

---

## MEDIUM — Fix This Month (Total: ~5–8 hours)

### M1 — Create YouTube channel and upload the recap video

This is the single highest-impact GEO action. YouTube presence correlates at ~0.737 with AI citation frequency. Upload the existing `recap.mp4` with a title like "Wrestle With Jimmy — Live Weezer Cover | Mohawk Austin 2025." Then:
- Add the YouTube URL to `sameAs` in `index.html` MusicGroup schema
- Update `VideoSection.jsx` to embed via `<iframe>` instead of S3 `<video>`
- Add `VideoObject` schema in `index.html`
- Update `llms.txt` Links section

### M2 — Create social profiles and populate sameAs

Create profiles on Instagram, Facebook, Bandsintown, and Songkick. Then update `sameAs` in the MusicGroup schema:
```json
"sameAs": [
  "https://www.instagram.com/wrestlewithjimmy",
  "https://www.facebook.com/wrestlewithjimmy",
  "https://www.youtube.com/@wrestlewithjimmy",
  "https://www.bandsintown.com/a/wrestlewithjimmy",
  "https://www.songkick.com/artists/wrestlewithjimmy"
]
```
Only add URLs that exist. A 404 on a sameAs target degrades entity confidence.

### M3 — Fix canonical URL trailing slash consistency (5 min)

**File:** `index.html`

Standardize all self-referencing URLs to use trailing slash (to match the sitemap):
- `<link rel="canonical" href="https://wrestlewithjimmy.com/">` (add slash)
- `<meta property="og:url" content="https://wrestlewithjimmy.com/">` (add slash)
- WebSite schema `"url": "https://wrestlewithjimmy.com/"` (add slash)

### M4 — Fix gallery shuffle CLS (20 min)

**File:** `src/components/Gallery.jsx`

Move the `shuffle(allPhotos)` call from `useMemo` into a `useEffect`, so the SSR output is stable and the shuffle only runs after hydration. This eliminates the hydration mismatch CLS.

### M5 — Give each gallery photo a unique alt text

**File:** `src/data/photos.js`

All 18 Barton Springs photos share the same alt text; all 14 Radio East photos share the same alt text. Each should describe the specific frame (who is playing, what instrument, what moment, facial expression, crowd, etc.). Update via Google Sheet + sync.

### M6 — Fix footer navigation

**File:** `src/components/Footer.jsx`

Footer links only About, Gallery, Book Us. Add Videos, Shows, Reviews to match the primary nav. Low-effort, improves internal linking and user navigation.

### M7 — Update "10+ Venues" stat

**File:** `src/data/content.js` (Google Sheet)

Events data shows 13+ distinct past venues. The stat reads "10+." Either drive this dynamically from `events.js` or update the copy to match the actual number.

### M8 — Automate sitemap lastmod on deploy

**File:** `public/sitemap.xml` + build script

Add a step to the `npm run build` or `sync-and-deploy` script that stamps today's date in `<lastmod>`. Current value is 6 weeks stale.

### M9 — Expand llms.txt passage lengths

**File:** `public/llms.txt`

Each section should reach ~134–150 words for reliable AI citation. Expand:
- What We Play: add what makes a WWJ set distinctive (energy, setlist variety, audience interaction)
- Where We've Played: add context for notable venues (Brisketfest crowd size, Mohawk headline status)
- Add a `## Band Members` section with first names and instruments
- Add a `## Booking Details` section with event types, geography, set length, contact info
- Update Upcoming Shows to remove May 14 and keep May 23

### M10 — Dynamic event schema generation

**File:** `scripts/prerender.mjs`

Hardcoded Event JSON-LD in `index.html` drifts from `src/data/events.js` every time shows change. Generate the schema block dynamically from events data during the prerender step so they stay in sync automatically. Filter to only include `upcoming: true` events, and include only events with a future `startDate`.

---

## LOW — Backlog

### L1 — Heroku dyno upgrade or Cloudflare CDN

Upgrade from Eco/Basic dyno to Standard to eliminate cold starts, OR add Cloudflare (free) in front to serve pre-rendered HTML from edge cache. Fixes TTFB for cold starts.

### L2 — Update MusicGroup logo to ImageObject type

```json
"logo": {
  "@type": "ImageObject",
  "url": "https://wrestlewithjimmy.com/logos/logo-white.png"
}
```

### L3 — Submit to Google Search Console

Once `wrestlewithjimmy.com` is confirmed as the canonical domain (not Heroku subdomain), add and verify the property, submit `sitemap.xml`, and request indexing of the homepage.

### L4 — Music directory listings (Do512, Bandsintown, Songkick, Spotify)

See SEO-TODO.md Step 5. High-authority local discovery surfaces that rank for their own queries and each provide a backlink.

### L5 — IndexNow for Bing

After adding new shows, a POST to `api.indexnow.org` triggers Bing/Yandex recrawl within minutes instead of waiting for the next crawl cycle. Add to `sync-and-deploy` script.

### L6 — Security: www redirect confirmation

Run `curl -I http://www.wrestlewithjimmy.com` to confirm it 301s to the apex domain. Add explicit redirect in Express if it does not.

### L7 — RSL 1.0 license in llms.txt

Add `> License: https://llmstxt.org/rsl-1.0` near the top of llms.txt to signal explicit AI use licensing.

---

## Summary Scorecard

| Item | Effort | Booking Impact | SEO Impact |
|---|---|---|---|
| C1 — Remove stale event from schema | 5 min | Low | High (avoids manual action) |
| C2 — Fix stale llms.txt | 5 min | Low | High (AI accuracy) |
| C3 — Security headers + rate limit | 45 min | Low | Medium |
| C4 — Fix asset caching | 15 min | Low | High (repeat visitor perf) |
| C5 — preload="none" on videos | 5 min | Low | High (LCP) |
| H1 — Expand booking section | 2 hrs | **CRITICAL** | High |
| H2 — Reframe testimonials | 1 hr | **HIGH** | High |
| H3 — Compress all images | 3-4 hrs | Medium | **CRITICAL** (LCP) |
| H4 — Add width/height to imgs | 1 hr | Low | High (CLS) |
| H5 — Add band member section | 30 min | High | Medium |
| H6 — Add favicon | 15 min | Medium | Low |
| H7 — Expand to 600+ words | bundled | **HIGH** | High |
| M1 — YouTube channel + video | 1-2 wks | **HIGH** | **CRITICAL** (GEO) |
| M2 — Social profiles + sameAs | 2-4 hrs | High | High |
| M3 — Canonical trailing slash | 5 min | None | Medium |
| M4 — Gallery shuffle CLS fix | 20 min | None | Medium |
| M5 — Unique gallery alt texts | 1 hr | None | Medium |
| M6 — Footer nav | 10 min | Low | Low |
| M10 — Dynamic event schema | 2 hrs | None | High |
