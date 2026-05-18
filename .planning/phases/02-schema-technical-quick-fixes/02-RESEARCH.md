# Phase 2: Schema, Technical & Quick Fixes — Research

**Researched:** 2026-05-18
**Domain:** JSON-LD structured data, React SSR/hydration, HTML video preload, favicon
**Confidence:** HIGH

---

## Summary

Phase 2 is a set of seven surgical fixes — no new dependencies needed. Four fixes are
pure text edits to `index.html` (SCHEMA-01 through SCHEMA-03, PERF-07) and one is a
text edit to a static file (`public/llms.txt`, SCHEMA-04). Two fixes are React component
changes: adding `preload="none"` to two video elements (PERF-05) and moving a shuffle
call from `useMemo` to `useEffect` in Gallery.jsx (PERF-06).

All seven requirements have been confirmed against the actual source files. The current
state of each file is fully known — the additional-context supplied to this research run
was verified against the live files. No surprises found.

The one open question is the Rock-Box ticket price. Events.js has no `price` field for
that event, and the Stubwire ticket page is an external URL. The Offer block in
index.html must receive a `price` value for SCHEMA-02; the planner should include a
task that checks the Stubwire page for the actual price and hardcodes it, or uses `"0"`
only if the event is confirmed free.

**Primary recommendation:** All seven fixes are independent and can be executed in a
single plan as three sequential task groups: (1) index.html edits, (2) llms.txt edit,
(3) React component patches.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SCHEMA-01 | Remove the May 14 Meanwhile Brewing event from the JSON-LD ItemList | Event confirmed as `upcoming: false` in events.js; the ItemList entry exists at position 1 in index.html and must be deleted; Rock-Box entry re-numbered to position 1 |
| SCHEMA-02 | Add `price` and `priceCurrency` to the Rock-Box Offer block | Google Rich Results requires both fields for paid events; current Offer block has `url` and `availability` only; price value must be determined before the edit |
| SCHEMA-03 | Add trailing slash to canonical, og:url, WebSite url, and sitemap `<loc>` | All four locations currently use `https://wrestlewithjimmy.com` (no slash); sitemap.xml already has the slash; only index.html needs three edits |
| SCHEMA-04 | Remove May 14 show from llms.txt Upcoming Shows | Static file edit — delete one bullet line; May 23 Rock-Box line stays |
| PERF-05 | Add `preload="none"` to both video elements | Hero.jsx and VideoSection.jsx both missing the attribute; straightforward JSX prop addition |
| PERF-06 | Move gallery shuffle from `useMemo` to `useEffect` to eliminate SSR/hydration CLS | `useMemo` runs during SSR and produces a different random order than client hydration; fix requires useState + useEffect pattern |
| PERF-07 | Create favicon.png and declare it in index.html | No favicon file exists in `/public/`; logo assets exist in `/public/logos/` as PNG source material |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| JSON-LD structured data | Static HTML (index.html) | — | Schema is hardcoded in index.html head; prerender.mjs only injects SSR body HTML, not schema |
| llms.txt accuracy | Static file (public/) | — | Plain text file served directly by Express static middleware |
| Video preload hint | Frontend component (JSX) | Browser | `preload` is an HTML attribute on the `<video>` element; set in JSX |
| Gallery CLS fix | Frontend component (JSX) | Browser | Shuffle randomness is client-only behavior; must not run during SSR |
| Favicon | Static file (public/) + Static HTML | — | PNG file in public/, `<link rel="icon">` tag in index.html `<head>` |
| Canonical / og:url | Static HTML (index.html) | — | Meta tags in `<head>` of index.html |

---

## Standard Stack

### Core (all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.3.1 | Component rendering + SSR | Already in use; useEffect is the standard SSR-safe client-only pattern |
| Vite | 5.4.x | Build + dev server | Already in use |

### Supporting (no new installs needed)

No new packages required for any of the seven fixes. All changes are HTML edits, static
file edits, or JSX prop/hook changes.

---

## Architecture Patterns

### System Architecture Diagram

```
index.html (source)
  └── <head> JSON-LD scripts ──────────────────────── served to browsers & crawlers
  └── <body><div id="root">                          ↑
        └── vite build → dist/index.html             │ Google Rich Results Test reads this
              └── prerender.mjs injects SSR HTML     │
                    └── entry-server.js (React SSR)  │
                          └── Gallery.jsx (shuffle)  │
                                                     │
public/llms.txt ─────────────────────────────── served at /llms.txt (LLM crawlers)
public/favicon.png ──────────────────────────── served at /favicon.png
```

**Key architectural fact:** prerender.mjs does NOT touch JSON-LD. It only replaces
`<div id="root"></div>` with the SSR-rendered HTML string. All schema edits go directly
in `index.html` (and will pass through to `dist/index.html` via Vite's static asset
copy during build).

### Pattern 1: Editing JSON-LD in index.html

**What:** index.html contains three `<script type="application/ld+json">` blocks. The
ItemList block has two event entries; the Meanwhile Brewing entry (position 1) must be
removed and the Rock-Box entry (position 2) updated to position 1 with a complete Offer.

**When to use:** Direct file edit. No generation script needed for Phase 2; dynamic
generation is deferred to Phase 5 (GEO-04).

**Current ItemList structure (verbatim from file):**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    { "@type": "Event", "position": 1, "name": "Wrestle With Jimmy at Meanwhile Brewing Company", ... },
    { "@type": "Event", "position": 2, "name": "Wrestle With Jimmy at The Rock-Box", ... }
  ]
}
```

**Target state:**
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
        "price": "??",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "url": "https://www.stubwire.com/e/37806/anthem182/therockbox/"
    }
  ]
}
```

### Pattern 2: Gallery SSR-Safe Shuffle (useEffect)

**What:** Move non-deterministic shuffle out of `useMemo` (which runs on server during
SSR) and into `useEffect` (which runs only on the client after hydration). Serve a
deterministic order on SSR and apply shuffle after mount.

**Why useMemo causes CLS:** During Vite SSR, `useMemo` executes on the server and
produces order A. On the client, React re-runs `useMemo` during hydration and produces
order B (different random seed). React sees mismatched HTML → CLS as it reconciles.

**Fix pattern — verified canonical approach:**
```jsx
// Source: React docs https://react.dev/reference/react/useEffect
import { useState, useEffect } from 'react'

export default function Gallery({ onOpenPhoto }) {
  // SSR renders allPhotos in stable (unshuffled) order — no mismatch
  const [photos, setPhotos] = useState(allPhotos)

  // Runs only after hydration — safe to use Math.random()
  useEffect(() => {
    setPhotos(shuffle(allPhotos))
  }, [])

  // ... rest of component unchanged
}
```

**Key detail:** `useState(allPhotos)` initializes with the full unshuffled array. The
SSR output and initial client render are identical (no hydration warning). After mount,
`useEffect` fires once and shuffles — a single, imperceptible reorder.

### Pattern 3: video preload="none"

**What:** Add `preload="none"` as a JSX prop to both video elements.

**Hero.jsx** — background autoplay video. Note: MDN documents that `preload` is
technically a hint and may be ignored when `autoPlay` is present. Adding it is still
correct for browsers that honor the hint and for Lighthouse audit compliance. [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video]

```jsx
// Hero.jsx — add preload="none"
<video
  className={styles.videoBg}
  src={recapVideo.src}
  poster="/photos/barton-springs/hero-1.jpg"
  autoPlay
  loop
  muted
  playsInline
  preload="none"
/>
```

**VideoSection.jsx** — user-controlled video. `preload="none"` is unambiguously
effective here because `autoPlay` is absent.

```jsx
// VideoSection.jsx — add preload="none"
<video
  src={recapVideo.src}
  poster="/photos/barton-springs/hero-1.jpg"
  title={recapVideo.title}
  controls
  preload="none"
  className={styles.embed}
/>
```

### Pattern 4: Favicon

**What:** Create `public/favicon.png` (a square PNG, typically 32×32 or 48×48 px) and
add a `<link rel="icon" type="image/png" href="/favicon.png" />` tag to the `<head>`
in index.html.

**Source material:** `/public/logos/logo-black.png` and `logo-white.png` exist as
potential source images to crop/resize.

**Recommended tag (HTML standard):**
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

**Note:** A PNG favicon at 32×32 or 48×48 is sufficient for modern browsers. An .ico
file is not required. If the logo PNG is already square or can be cropped, the planner
should include a task step for resizing with a readily available tool (ImageMagick,
Squoosh, or manual crop).

### Pattern 5: Trailing Slash — Canonical and og:url

**What:** Three locations in index.html need the trailing slash added.

| Location | Current | Target |
|----------|---------|--------|
| `<link rel="canonical" href="...">` | `https://wrestlewithjimmy.com` | `https://wrestlewithjimmy.com/` |
| `<meta property="og:url" content="...">` | `https://wrestlewithjimmy.com` | `https://wrestlewithjimmy.com/` |
| WebSite JSON-LD `"url":` field | `https://wrestlewithjimmy.com` | `https://wrestlewithjimmy.com/` |

**sitemap.xml** — already correct (`<loc>https://wrestlewithjimmy.com/</loc>`). No edit needed.

**MusicGroup JSON-LD `"url":` field** — currently `https://wrestlewithjimmy.com`
(no trailing slash). SCHEMA-03 text says "canonical tag, og:url, WebSite schema url,
and sitemap `<loc>`" — MusicGroup url is not listed. Leave MusicGroup url unchanged
unless the planner decides to normalize it for consistency (this is discretionary).

### Anti-Patterns to Avoid

- **Do not modify prerender.mjs for Phase 2 schema changes.** prerender.mjs only
  injects SSR HTML. Adding schema generation there is Phase 5 work (GEO-04). For
  Phase 2, edit index.html directly.
- **Do not use `useMemo` for client-only random/Date values.** `useMemo` executes
  during SSR. Always use `useEffect` + `useState` for values that must differ between
  server and client.
- **Do not suppress hydration warnings with `suppressHydrationWarning`.** That is an
  escape hatch, not a fix. The correct fix is deterministic SSR state + useEffect.
- **Do not add `preload="auto"` or omit the attribute.** Omitting defaults to
  `preload="auto"` in most browsers, which downloads video data on page load.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Schema validation | Manual JSON inspection | Google Rich Results Test (https://search.google.com/test/rich-results) |
| Favicon creation from logo | Custom image processing script | ImageMagick `convert` or online tool (Squoosh/favicon.io) |
| CLS measurement | Manual testing | Lighthouse CLS score in Chrome DevTools |

---

## Common Pitfalls

### Pitfall 1: Forgetting to re-number position after removing the first event

**What goes wrong:** The Rock-Box entry currently has `"position": 2`. After removing
the Meanwhile Brewing entry, it must be updated to `"position": 1`. Leaving it as 2
won't break Google ingestion but is technically incorrect for a single-item list.

**How to avoid:** Edit both the deletion and the position field in the same task.

### Pitfall 2: Rock-Box price value unknown

**What goes wrong:** SCHEMA-02 requires `price` in the Offer block. Neither events.js
nor any other project file contains a price for the Rock-Box show. The Stubwire URL is
the source of truth. If a placeholder is used (e.g., `"0"`) and the event is actually
paid, Google may flag it.

**How to avoid:** The plan must include a lookup step: check the Stubwire URL and record
the actual ticket price before writing the JSON-LD edit. See Open Questions below.

### Pitfall 3: autoPlay + preload="none" interaction in Hero.jsx

**What goes wrong:** The spec allows browsers to ignore `preload` when `autoPlay` is
present. Some browsers (Chrome especially) will preload the video anyway for
background autoplay.

**How to avoid:** Add the attribute regardless — Lighthouse rewards the presence of the
hint, and mobile browsers typically honor it even when autoplay is set. This is the
correct implementation for PERF-05; do not skip it.

### Pitfall 4: useEffect shuffle causes a visible flash of reorder

**What goes wrong:** If the gallery mounts with photos in unshuffled order and then
immediately reshuffles in useEffect, users may see a brief layout shift.

**How to avoid:** In practice, useEffect fires before the browser paints the first
visible frame (it fires synchronously after React commits the DOM). The reorder is
imperceptible. This is the canonical React pattern for SSR-safe client-only
randomization. [CITED: https://react.dev/reference/react/useEffect]

### Pitfall 5: MusicGroup url not updated (SCHEMA-03 scope question)

**What goes wrong:** SCHEMA-03 explicitly lists "canonical tag, og:url, WebSite schema
url, and sitemap `<loc>`". The MusicGroup `"url"` field is also `https://wrestlewithjimmy.com`
without a trailing slash but is NOT in the SCHEMA-03 list. Accidentally leaving it out
or accidentally including it both risk confusion.

**How to avoid:** Follow the requirement verbatim — update only the four listed
locations. Note MusicGroup url as an acknowledged deviation in the plan comment.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Rock-Box ticket price is unknown; the planner must look up the Stubwire page | Common Pitfalls / Open Questions | If a wrong price is hardcoded, Google Rich Results may flag structured data errors |
| A2 | Favicon image can be derived from the existing logo-black.png (crop/resize to square) | Pattern 4 | If the logo is unsuitable for square crop, a different source image must be created |

---

## Open Questions

1. **What is the Rock-Box ticket price?**
   - What we know: The Stubwire URL is `https://www.stubwire.com/e/37806/anthem182/therockbox/`. Events.js has no price field.
   - What's unclear: Whether the show is free, $5, $10, or another amount.
   - Recommendation: The plan task for SCHEMA-02 must include a step: "Check the Stubwire ticket URL and record the price. Use that value for the `price` field. Use `"USD"` for `priceCurrency`." If the event is free, use `"0"`.

2. **Should MusicGroup `"url"` also get a trailing slash?**
   - What we know: SCHEMA-03 does not list MusicGroup url. The current value is `https://wrestlewithjimmy.com`.
   - What's unclear: Whether this was intentional or an oversight in the requirement.
   - Recommendation: Normalize it for consistency in the same edit, noting it exceeds the strict requirement scope. Low risk.

---

## Environment Availability

No external tools or services required beyond standard Node.js and a browser/HTTP client
for the Rock-Box price lookup. All changes are file edits.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build pipeline | Yes | Installed | — |
| Image resize tool | PERF-07 favicon creation | Needs check | — | Use online tool (favicon.io, Squoosh) if ImageMagick absent |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no pytest.ini, jest.config.*, or vitest.config.* found |
| Config file | None — see Wave 0 |
| Quick run command | `npm run build` (smoke test: build succeeds and prerender completes) |
| Full suite command | Google Rich Results Test (manual) + Lighthouse CLS audit (manual) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCHEMA-01 | No past events in rendered JSON-LD ItemList | smoke | `npm run build && grep "Meanwhile Brewing" dist/index.html` (must return no match) | Wave 0 |
| SCHEMA-02 | Rock-Box Offer has price + priceCurrency | smoke | `npm run build && node -e "const h=require('fs').readFileSync('dist/index.html','utf8'); const m=h.match(/Rock-Box[\s\S]{0,500}price/); console.log(m?'PASS':'FAIL')"` | Wave 0 |
| SCHEMA-03 | Canonical and og:url end with trailing slash | smoke | `grep -c 'wrestlewithjimmy.com/"' dist/index.html` (expect 3+) | Wave 0 |
| SCHEMA-04 | May 14 show absent from llms.txt | smoke | `grep "May 14" public/llms.txt` (must return no match) | Wave 0 |
| PERF-05 | Both video elements have preload="none" | smoke | `grep -r 'preload="none"' src/components/` (expect 2 matches) | Wave 0 |
| PERF-06 | Gallery shuffle not in useMemo | unit | `grep 'useMemo.*shuffle\|shuffle.*useMemo' src/components/Gallery.jsx` (must return no match) | Wave 0 |
| PERF-07 | Favicon declared in index.html | smoke | `grep 'rel="icon"' index.html` (must return match) | Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run build` — verifies build still compiles
- **Per wave merge:** All grep smoke checks above
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] No automated test infrastructure — all validation is grep-based smoke tests and manual browser/Google checks
- [ ] `npm run build` must succeed end-to-end as the minimum gate

---

## Security Domain

These changes are static file edits and React prop additions. No new input paths, no
authentication changes, no cryptographic operations.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | No | No user input in any Phase 2 change |
| V6 Cryptography | No | — |
| V2 Authentication | No | — |
| V4 Access Control | No | — |

No security concerns for Phase 2.

---

## Sources

### Primary (HIGH confidence)
- `/Users/henrygillard/code/wwj-website/index.html` — direct file read, ground truth for all schema issues
- `/Users/henrygillard/code/wwj-website/src/components/Gallery.jsx` — direct file read, confirms useMemo shuffle
- `/Users/henrygillard/code/wwj-website/src/components/Hero.jsx` — direct file read, confirms missing preload attr
- `/Users/henrygillard/code/wwj-website/src/components/VideoSection.jsx` — direct file read, confirms missing preload attr
- `/Users/henrygillard/code/wwj-website/public/llms.txt` — direct file read, confirms May 14 entry present
- `/Users/henrygillard/code/wwj-website/src/data/events.js` — direct file read, confirms upcoming flags
- `/Users/henrygillard/code/wwj-website/public/sitemap.xml` — direct file read, confirms sitemap already has trailing slash
- [Google Event structured data documentation](https://developers.google.com/search/docs/appearance/structured-data/event) — confirms price/priceCurrency required for Offer
- [MDN — video element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video) — confirms preload attribute values and autoPlay interaction
- [React useEffect docs](https://react.dev/reference/react/useEffect) — confirms useEffect is client-only, correct pattern for SSR-safe randomization

### Secondary (MEDIUM confidence)
- [WebSearch: React SSR hydration mismatch fix] — multiple sources confirm useEffect is canonical fix; aligns with React docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions confirmed from installed packages
- Architecture: HIGH — all key files read directly; no speculation
- Pitfalls: HIGH — confirmed from direct file inspection; schema rules from official Google docs
- Rock-Box price: LOW — not available in codebase; requires external lookup

**Research date:** 2026-05-18
**Valid until:** 2026-06-17 (stable domain; event dates are the only time-sensitive element)
