# SEO Improvements — May 2026

Research via `claude-seo:seo-technical` + `claude-seo:seo-schema` agents.

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
