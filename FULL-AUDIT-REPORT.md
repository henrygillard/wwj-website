# SEO Audit Report — wrestlewithjimmy.com

**Audit Date:** 2026-05-17
**Site:** https://wrestlewithjimmy.com
**Business:** Wrestle With Jimmy — Austin's Weezer cover band
**Primary Goal:** Convert event bookers (venues, festivals, corporate events, private parties) who search for a Weezer cover band or Austin cover band for hire.

---

## Overall SEO Health Score: 52 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 58 | 12.8 |
| Content Quality | 23% | 52 | 12.0 |
| On-Page SEO | 20% | 60 | 12.0 |
| Schema / Structured Data | 10% | 55 | 5.5 |
| Performance (CWV) | 10% | 30 | 3.0 |
| AI Search Readiness | 10% | 54 | 5.4 |
| Images | 5% | 30 | 1.5 |
| **Total** | | | **52 / 100** |

---

## Executive Summary

The site has a solid technical foundation — pre-rendered HTML, a valid canonical tag, correct robots.txt, and a well-structured llms.txt. Schema is present. The core SEO gap is not technical; it is commercial.

**The site does not yet communicate to event bookers that Wrestle With Jimmy is the best choice for their event.** A venue booker landing on the page learns the band exists and plays Weezer. They do not learn: what makes a WWJ set special, which types of venues they've headlined, what the booking process looks like, how much lead time is needed, or what they'll get. The satirical testimonials section actively undercuts trust at the moment a professional booker is evaluating the band.

Simultaneously, performance is in the critical range: the hero image is 7MB, all assets lack caching, and images have no dimension attributes. A booker on a mobile connection may bounce before the page finishes loading.

**Top 5 critical issues:**
1. Hero image is 7MB — kills LCP and reflects poorly on site professionalism
2. No security headers — zero Helmet middleware on Express server
3. Event schema shows a past show (May 14) as `EventScheduled` — stale structured data
4. Booking section has one sentence of copy — insufficient to convert a professional booker
5. sameAs is empty — no entity authority signals for Google or AI search

**Top 5 quick wins (< 1 hour each):**
1. Remove the May 14 event from JSON-LD schema (5 min)
2. Add `preload="none"` to both `<video>` elements (5 min)
3. Add Helmet to Express server (30 min)
4. Add rate limiting to `/api/contact` (20 min)
5. Fix canonical URL trailing slash consistency (5 min)

---

## Business Context

**Primary conversion action:** An event booker emails `wrestlewithjimmyatx@gmail.com` or submits the contact form.

**Target audience:** Venue talent buyers, festival coordinators, corporate event planners, and private event hosts in Austin, TX and surrounding Central Texas.

**Primary keywords:**
- "Weezer cover band Austin" (high intent, low competition)
- "Austin cover band for hire" (booking intent)
- "Weezer tribute band Texas" (regional reach)
- "book a cover band Austin TX" (transactional)

**Previous audit reference:** SEO-TODO.md (2026-04-06) — Steps 1 (pre-rendering) and H1 fix are already done. Steps 2–7 remain open.

---

## 1. Technical SEO (Score: 58/100)

### 1.1 Crawlability — PASS

- robots.txt allows all crawlers and correctly declares the sitemap
- Sitemap is valid XML with 1 URL (correct for a single-page app)
- `lastmod: 2026-04-06` is 6 weeks stale — should update with each deploy
- No `noindex` tags
- Pre-rendered HTML means all content is readable without JavaScript

### 1.2 Indexability — PASS with warnings

- Canonical: `<link rel="canonical" href="https://wrestlewithjimmy.com">` — no trailing slash
- Sitemap uses `https://wrestlewithjimmy.com/` — with trailing slash
- og:url uses `https://wrestlewithjimmy.com` — no trailing slash
- **These must all match.** Pick one form and standardize. Trailing slash is preferred since that is what the sitemap uses.
- Title (72 chars): good, keyword-rich
- Meta description: present, well-written
- No favicon declared (`<link rel="icon">` missing) — blank favicon in SERPs

### 1.3 Security Headers — CRITICAL FAIL

Zero security headers on the Express server. Missing:

| Header | Risk |
|---|---|
| `Strict-Transport-Security` | Allows protocol downgrade; Google ranking signal |
| `X-Content-Type-Options: nosniff` | MIME-sniffing attacks |
| `X-Frame-Options: SAMEORIGIN` | Clickjacking |
| `Content-Security-Policy` | No XSS protection at HTTP layer |
| `Referrer-Policy` | Full URL leaked to third-party resources |

Fix: `npm install helmet` and add `app.use(helmet())` in `server/index.js` before all routes.

**Additionally:** The `/api/contact` HTML email template (`server/index.js:46-52`) interpolates `name`, `email`, and `message` directly into an HTML string with no escaping — HTML injection vulnerability in outgoing email. Add a simple `esc()` helper. No rate limiting on this endpoint either — it can be flooded to exhaust Gmail sending quota.

### 1.4 Caching — CRITICAL FAIL

Every asset — including the hashed JS/CSS bundles — is served with `cache-control: public, max-age=0`. The filename hash (`/assets/index-CE2T5aA-.js`) exists exactly to enable long-term immutable caching. Its value is completely wasted.

Fix in `server/index.js`:
```js
app.use('/assets', express.static(join(__dirname, '../dist/assets'), {
  maxAge: '1y',
  immutable: true,
}))
app.use(express.static(join(__dirname, '../dist'), { maxAge: '5m' }))
```

### 1.5 URL Structure — PASS

Single-page app with anchor navigation. Heroku handles HTTPS. No redirect chains. Confirm `www.wrestlewithjimmy.com` 301s to apex.

### 1.6 Sitemap — PASS with notes

Single URL sitemap is correct for a SPA. Automate `lastmod` to stamp on every deploy in the build script.

---

## 2. Content Quality (Score: 52/100)

**This is the most important section for booking conversion.**

### 2.1 Thin Content — CRITICAL

Total indexable copy: ~305 words. Minimum for homepage authority: 500+. Four sections (Gallery, Video, Events, Contact) contribute essentially zero prose content. Google has insufficient text to establish topical relevance for booking-intent queries.

More importantly: a booker who lands on this page gets one paragraph about who the band is and a form. There is nothing here to help them decide to hire WWJ over any other option.

**What bookers need to see and do not:**
- What makes a WWJ set different from other cover bands?
- What venue types and capacities have you played?
- What is the geographic radius? How far will the band travel?
- How much lead time is needed for a booking?
- Is the band self-contained (owns PA, lights) or do they require backline?
- What does a typical set look like — 1 set of 45 min? 2 x 45?
- What's the direct email or phone if the form doesn't work?

### 2.2 Satirical Testimonials — HIGH priority trust risk

The Testimonials section reads: *"Totally real, completely unsponsored testimonials from actual Weezer fans."* followed by humorous fake reviews.

The humor lands for a fan. It does not land for a venue talent buyer using the page to make a professional evaluation. The "totally real" framing is indistinguishable from genuine testimonials at a glance and signals low seriousness to a professional booker.

Additionally, Google's 2025 QRG treats review authenticity as a Trustworthiness sub-signal. Fabricated or satirical content framed as genuine review text is flagged by quality raters. AI models will also cite these as real testimonials in response to queries about the band.

**Fix options (in order of impact for booking conversion):**
1. Replace 2–3 fake reviews with real quotes from actual bookers or venue contacts (Central Machine Works, Independence Brewing, Meanwhile Brewing). Even a brief "Great energy, crowd loved it — [Venue Name]" from a real booking contact is worth 10 satirical ones.
2. Rename the section to "The WWJ Canon" or "Fan Lore" to signal creative fiction, and add a separate "From the Venues" block above it with real quotes.
3. At minimum, remove the "Totally real, completely unsponsored" framing.

### 2.3 No Band Member Information — HIGH

No names, no instruments, no backstory. A booker hiring a live act wants to know who they are getting. Named individuals are also a core E-E-A-T Experience/Expertise signal.

Fix: Add a short "Meet the Band" subsection in About — first names, instruments, one line each.

### 2.4 No Author/Byline Signals — MEDIUM

No press quotes, no "as seen at" credibility markers. The venue name-drops in About are good but need one sentence of context each (crowd size, event type, recurring booking status) to function as genuine credibility signals.

### 2.5 E-E-A-T Summary

| Factor | Score | Notes |
|---|---|---|
| Experience | 62/100 | Venue name-drops good; no captions, no setlists |
| Expertise | 45/100 | Song/album references good; no member bios |
| Authoritativeness | 38/100 | No press, no external social proof |
| Trustworthiness | 44/100 | Fake review framing active liability |

---

## 3. On-Page SEO (Score: 60/100)

### 3.1 Title Tag — PASS

"Wrestle With Jimmy — Austin's Weezer Cover Band | Live Shows & Booking" — 72 characters, good keyword coverage including "booking."

### 3.2 Meta Description — PASS

Present, descriptive, within character limits.

### 3.3 H1 — WARNING

The rendered H1 is "WWJ" (three letters). The `aria-label` is "WWJ — Wrestle With Jimmy" but search engines index the DOM text, not aria-label. The H1 carries almost no keyword signal for the queries "Weezer cover band Austin" or any booking-intent phrase. This was flagged as "fixed" in SEO-TODO.md but is still thin.

Consider either changing the H1 text to "Wrestle With Jimmy" with CSS handling the visual "WWJ" treatment, or adding an immediately adjacent visible subtitle that contains the primary keyword phrase.

### 3.4 Heading Hierarchy — PASS

H2s cover all six sections. H3 used for "Past Shows."

### 3.5 Open Graph / Twitter Card — PASS

All tags present and populated with correct values.

### 3.6 Internal Navigation — PARTIAL

Nav links all 6 sections. Footer only links 3 of 6 — missing Videos, Shows, Reviews.

### 3.7 Favicon — FAIL

No `<link rel="icon">` in index.html. Blank favicon in Google SERPs looks unprofessional, particularly when the SERP result is being evaluated by a booker doing due diligence.

---

## 4. Schema / Structured Data (Score: 55/100)

### 4.1 MusicGroup Schema — PASS with critical gap

All required fields present. **Critical issue: `sameAs: []` is empty.** This explicitly asserts the band has no web presence elsewhere, which suppresses Knowledge Graph entity confidence. No social profiles have been created yet (SEO-TODO.md Step 3).

Also: `logo` should be an `ImageObject` type, not a bare URL string.

### 4.2 WebSite Schema — PASS

Correct structure, properly cross-references MusicGroup `@id`.

### 4.3 Event ItemList Schema — FAIL

Two issues:

**1 — Critical: May 14 event (Meanwhile Brewing) is 3 days in the past but `eventStatus` is still `EventScheduled`.** Google's event markup documentation states past events should be removed from structured data. Serving a stale `EventScheduled` for a completed event can trigger a manual action against event markup eligibility. This also looks unprofessional to any booker who notices.

**2 — High: May 23 event (Rock-Box) Offer is missing `price` and `priceCurrency`.** Required for event rich result eligibility.

**Corrected Event schema (remove May 14, fix May 23):**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Event",
      "position": 1,
      "name": "Wrestle With Jimmy at The Rock-Box",
      "startDate": "2026-05-23",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "The Rock-Box",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "San Antonio",
          "addressRegion": "TX",
          "addressCountry": "US"
        }
      },
      "performer": { "@id": "https://wrestlewithjimmy.com/#musicgroup" },
      "organizer": { "@id": "https://wrestlewithjimmy.com/#musicgroup" },
      "offers": {
        "@type": "Offer",
        "url": "https://www.stubwire.com/e/37806/anthem182/therockbox/",
        "price": "10",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "url": "https://www.stubwire.com/e/37806/anthem182/therockbox/"
    }
  ]
}
```

(Replace `"price": "10"` with the actual ticket price for the Rock-Box show.)

### 4.4 Missing: VideoObject

The recap video is currently on S3 (private, not crawlable by Google). Add VideoObject schema after uploading to YouTube (SEO-TODO.md Step 2).

### 4.5 Not Recommended: Review/AggregateRating

Correctly absent. The satirical testimonials should not receive review schema. Google's review policies prohibit this on non-genuine reviews.

---

## 5. Performance / Core Web Vitals (Score: 30/100)

| Metric | Estimated Value | Threshold | Status |
|---|---|---|---|
| LCP | 8–12s (4G) | ≤ 2.5s | Poor |
| CLS | 0.15–0.35 | ≤ 0.1 | Poor |
| INP | 80–120ms | ≤ 200ms | Good |

### 5.1 Hero Image — CRITICAL: 7MB JPEG

`/photos/barton-springs/hero-1.jpg` is **7,012,824 bytes** served on every page load with `max-age=0`. This is the LCP element (video poster) and it is catastrophically large. For context, the target for a hero background image is under 100KB.

The entire `/public/photos/` directory contains 139MB of full-resolution uncompressed JPEGs — never optimized for web delivery. Worst offenders: DSC07123.jpg (10MB), DSC06956.jpg (9.8MB), DSC07136.jpg (8.3MB).

**Fix:** Convert hero-1.jpg to WebP or AVIF at 1920px wide, targeting under 100KB. Do the same for all gallery images. Add `<link rel="preload" as="image" fetchpriority="high">` in index.html.

### 5.2 Background Video — CRITICAL: Competing with LCP

The hero `<video>` has no `preload="none"` attribute — browsers speculatively load video metadata (and potentially initial segments) immediately, competing with the hero poster image for bandwidth. The same video file also plays in the VideoSection with `controls`, creating two concurrent video requests on first load.

**Fix (5 minutes):** Add `preload="none"` to both `<video>` elements in `Hero.jsx` and `VideoSection.jsx`.

### 5.3 No Image Width/Height Attributes — HIGH (CLS)

Every `<img>` across all components is missing `width` and `height` attributes. The browser cannot allocate space before images load, causing layout shifts as 1–3.7MB images arrive. Gallery.jsx line 35:

```jsx
<img src={photo.src} alt={photo.alt} loading="lazy" />
```

**Fix:** Add explicit `width` and `height`, or add `aspect-ratio: 3/2; object-fit: cover` in CSS.

### 5.4 Zero Asset Caching — HIGH

All assets served with `max-age=0`. Hashed JS bundle (`index-CE2T5aA-.js`) and CSS get no caching benefit from their fingerprinted filenames. Fix in server/index.js (see Technical SEO section 1.4).

### 5.5 Gallery Shuffle Hydration Mismatch — LOW (CLS)

`Gallery.jsx` shuffles photos with `Math.random()` inside `useMemo`. The SSR order differs from the client hydration order, causing React to re-render the entire grid during hydration — visible layout shift.

**Fix:** Move the shuffle to a `useEffect` so SSR renders a stable order and shuffle only happens post-hydration.

### 5.6 Heroku Cold Starts — MEDIUM

Eco/basic dynos spin down after 30 min inactivity. First request after cold start can add 5–30s to TTFB. Pre-rendered HTML helps but does not eliminate the problem.

**Fix options:** Upgrade to Standard dyno (always-on), or add Cloudflare CDN to serve pre-rendered HTML from edge.

---

## 6. Images (Score: 30/100)

### 6.1 Duplicate Alt Text

| Alt Text | Count |
|---|---|
| "Wrestle With Jimmy performing live at Radio East, Austin TX" | 5 images |
| "Wrestle With Jimmy — Barton Springs promo shoot, Austin TX" | 5 images |

All 32 photos in the gallery fall into one of two identical alt text strings. Each photo should have a unique description (what's happening in the frame, who is doing what, which instrument, which moment).

### 6.2 Missing Dimensions

No `width` or `height` on any `<img>`. See CLS section above.

### 6.3 No WebP/AVIF Format

All images served as JPEG with no format negotiation. Modern browsers support WebP and AVIF, which compress 30–80% smaller than JPEG at equivalent quality.

### 6.4 File Sizes

| File | Size | Target |
|---|---|---|
| hero-1.jpg (LCP element) | 7.0 MB | < 100 KB |
| DSC06995.jpg (gallery) | 3.8 MB | < 120 KB |
| DSC5634.jpg (gallery) | 1.0 MB | < 120 KB |

**Full gallery optimization is the single largest performance improvement available.**

### 6.5 Logo Size

Nav logo PNG is approximately 2MB — excessive for a nav logo element. Target under 20KB.

---

## 7. AI Search Readiness / GEO (Score: 54/100)

| Platform | Score | Limiting Factor |
|---|---|---|
| Google AI Overviews | 48/100 | Thin E-E-A-T, empty sameAs |
| ChatGPT | 52/100 | No YouTube, empty sameAs, stale llms.txt |
| Perplexity | 60/100 | Best — rewards SSR + llms.txt |
| Bing Copilot | 45/100 | Weakest — no social graph |

### 7.1 llms.txt — PRESENT, STALE

`/llms.txt` is present and well-structured — this is a genuine advantage. However, the May 14 show is listed as "Upcoming" when it occurred 3 days ago. An AI surfacing this to a user asking about upcoming Austin shows will present wrong information.

**Fix (5 minutes):** Remove the May 14 entry from the Upcoming Shows section. Move to a Past Shows section or remove entirely.

### 7.2 sameAs — EMPTY

The MusicGroup `sameAs: []` is the highest-leverage GEO gap. Without cross-references, AI models treat the band as an unverified string rather than a confirmed entity. YouTube channel presence alone correlates at ~0.737 with AI citation frequency.

### 7.3 No YouTube Channel

This is the single most impactful missing signal for AI search. Every major AI search platform (Perplexity, ChatGPT, Google AI Overviews) weights YouTube heavily as a verification signal that an entity is real and active. Even one video — a smartphone recording titled "Wrestle With Jimmy — Buddy Holly (Live at Mohawk Austin)" — creates a citable, cross-referenceable entity.

### 7.4 llms.txt Content Quality

Passage lengths are below the 134-word threshold for reliable AI citation. The What We Play and Where We've Played sections are the strongest candidates for expansion. Add: founding context, set structure details, booking-specific copy (event types, travel range, setup requirements).

---

## 8. Prior Audit Items Status (from SEO-TODO.md, 2026-04-06)

| Step | Status |
|---|---|
| Step 1: Pre-rendering | Done ✅ |
| H1 fix | Partially done — H1 is still "WWJ" (thin), aria-label is better |
| Step 2: YouTube channel | Not done |
| Step 3: Social profiles + sameAs | Not done |
| Step 4: Expand content to 600+ words | Not done |
| Step 5: Music directory listings | Not done |
| Step 6: Replace satirical testimonials | Not done |
| Step 7: Submit to Google Search Console | Not done (blocked on custom domain) |
| Gallery image unique alt text | Not done |
| Image width/height attributes | Not done |
| Favicon | Not done |
| Security headers (Helmet) | Not done |
| Contact form rate limiting | Not done |
| Footer nav | Not done |
| "10+ Venues" stat accuracy | Not done (events.js shows 13+ venues) |
| Event schema dynamic generation | Not done |
