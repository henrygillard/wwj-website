# SEO Improvements — May 2026

Research via `claude-seo:seo-technical` + `claude-seo:seo-schema` + `claude-seo:seo-content` agents.

---

## Keyword Ranking Fixes — "Weezer Cover Band" (2026-05-26)

Root cause: title tag claimed the keyword but rendered body copy had almost no heading-level or depth signals to support it (~280 words, H1 = "WWJ", first H2 = "We are Wrestle With Jimmy.").

### Changes made

| Fix | File | Notes |
|---|---|---|
| About H2 → "Austin's Premier Weezer Cover Band" | `src/data/content.js` | ⚠️ Auto-generated — mirror in Google Sheet (About › Section heading) |
| Footer tagline: "tribute" → "cover" | `src/data/content.js` | ⚠️ Auto-generated — mirror in Google Sheet (Footer & Nav) |
| Title tag → keyword-first + Austin geo | `index.html` | `Weezer Cover Band \| Wrestle With Jimmy — Austin, TX` |
| Meta description → Austin + Blue Album | `index.html` | 149 chars, includes local signal + specific content reference |
| Schema `genre` → restored "Weezer Cover Band" | `index.html` | Also added "90s Alternative Rock" variant |
| Logo `alt` → keyword-bearing | `src/components/Nav.jsx` | `Wrestle With Jimmy — Weezer Cover Band` |

### H1 — not changed (intentional)
The H1 "WWJ" is a 3-character logo mark rendered at `clamp(6rem, 22vw, 16rem)`. Changing the text would break the hero layout. The first H2 on the page ("Austin's Premier Weezer Cover Band") is the correct keyword heading fix.

### Next steps for full impact
- **Update Google Sheet** for the two `content.js` changes before next sync
- **Expand About copy** to ~400 words naming albums (Blue Album, Pinkerton, Maladroit, Green Album) — this is the highest long-term lever
- **Add "What We Play" section** with H2 + setlist prose — captures long-tail queries
- **Verify SSR in prod**: `curl -s -A "Googlebot" https://wrestlewithjimmy.com/ | grep -i "weezer"` — if empty, Googlebot isn't seeing any of these signals

---

## Critical Fixes

### 1. In-body booking link — About section
**File:** `src/components/About.jsx`, `src/components/About.module.css`

Added `<a href="#contact">Book Wrestle With Jimmy →</a>` after the stats block. Nav/footer links to `#contact` are navigation chrome and discounted by Google. This is the first in-body anchor with booking keyword anchor text on the page.

---

### 2. Testimonials dead-end CTA
**File:** `src/components/Testimonials.jsx`, `src/components/Testimonials.module.css`

Added a "Ready to book your own Wrestle With Jimmy experience?" banner with a "Book Us →" link to `#contact` after the reviews grid. The highest-trust section on the page previously had no next step.

---

### 3. Stale Event schema removed
**File:** `index.html`

Removed the `ItemList`/`Event` block for the Rock-Box show (startDate: 2026-05-23, past). Google suppresses past events from rich results and the `"availability": "InStock"` on a past event triggers a validation error. The placeholder comment remains — add the block back when the next show is booked.

---

### 4. MusicGroup ↔ WebSite schema graph connected
**File:** `index.html`

- Added `mainEntityOfPage` to `MusicGroup` pointing to `#website`
- Added `about` to `WebSite` pointing to `#musicgroup`
- Typed `image` and `logo` as `ImageObject` (was bare string URLs)
- Expanded `foundingLocation` to include full `PostalAddress` (matching the Event schema pattern)

These properties create the bidirectional graph edges that Google's Knowledge Panel extraction depends on.

---

## High Priority

### 5. Events empty-state booking CTA
**File:** `src/components/Events.jsx`, `src/components/Events.module.css`

Added "Book us for your venue →" link to `#contact` in the no-shows empty state. Previously dead text.

---

### 6. Booking Service schema added
**File:** `index.html`

New `Service` JSON-LD block (`#booking-service`) linked from `MusicGroup` via `makesOffer`. This is the schema pattern that enables AI assistants to answer "book a Weezer cover band in Austin" with the band's contact. Properties: `provider`, `areaServed` (Texas), `serviceType` (Live Music Performance), `availableChannel` with contact email.

---

### 7. Sitemap `lastmod` auto-updated
**Files:** `public/sitemap.xml`, `scripts/sync-from-sheet.mjs`

- Updated `lastmod` to `2026-05-26`
- Added auto-update step to `sync-from-sheet.mjs` so every `npm run sync-content` keeps `lastmod` current

---

## Not implemented (rationale)

| Item | Reason |
|---|---|
| `SiteNavigationElement` schema | No documented Google benefit; zero ROI on a SPA |
| `BreadcrumbList` | Only for multi-page hierarchies; doesn't apply |
| `AggregateRating` schema | Testimonials are fictional/humorous — adding review schema would violate Google guidelines and risk a manual action |
| Page splitting `/shows`, `/booking` | Defer until GSC data shows ranking in positions 8–20 for booking queries; in-body linking fixes are the higher-ROI first step |
| Additional `sameAs` profiles | No other confirmed social profiles found in codebase; add when profiles are created |

---

## Future: When a new show is booked

Add an `Event` schema block back into `index.html` with:
- `startDate` including time + timezone (`2026-XX-XXTXX:XX:00-05:00`)
- `eventStatus`: `EventScheduled`
- `offers.availability`: `InStock`
- `offers.validFrom`: booking open date
- Link via `performer`/`organizer` `@id` to `#musicgroup`
