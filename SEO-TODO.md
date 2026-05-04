# SEO Remaining Steps

Reference from audit on 2026-04-06. Items are in priority order.
Steps 1 (pre-rendering) and H1 fix are already implemented.

---

## Step 2 — Upload Recap Video to YouTube

**Why:** YouTube is the single highest-correlation signal for AI citation. It also unlocks video rich results and is the strongest `sameAs` authority signal available to a music act.

**Actions:**
1. Create a YouTube channel for Wrestle With Jimmy
2. Upload `recap.mp4` (currently hosted on private S3)
3. Add the YouTube channel URL to `sameAs` in `index.html` (the array is currently empty)
4. Update `VideoSection.jsx` to embed the YouTube video via `<iframe>` instead of the S3 `<video>` tag — this also improves LCP since the video iframe is lazy-loaded
5. Add `VideoObject` schema to `index.html` pointing to the YouTube URL

---

## Step 3 — Create Social Profiles and Fill `sameAs`

**Why:** The `sameAs` array in `index.html` is `[]`. Google uses these cross-references to build entity confidence for the band in the Knowledge Graph.

**Profiles to create/claim:**
- Instagram
- Facebook page
- Bandsintown (`https://bandsintown.com`) — syncs with Spotify, has an embeddable upcoming shows widget
- Songkick (`https://songkick.com`) — Google pulls Songkick data for event rich results

**Then:** Add all profile URLs to `sameAs` in `index.html`:
```json
"sameAs": [
  "https://www.instagram.com/wrestlewithjimmy",
  "https://www.facebook.com/wrestlewithjimmy",
  "https://www.youtube.com/@wrestlewithjimmy",
  "https://www.bandsintown.com/a/wrestlewithjimmy",
  "https://www.songkick.com/artists/wrestlewithjimmy"
]
```

---

## Step 4 — Expand Content to 600+ Words

**Why:** The site has ~305 words total — well below the 500-word homepage minimum. Thin content limits topical coverage for any keyword.

**About section** — add ~200 words:
- Band member names and instruments
- Founding story (when/how the band started)
- What a WWJ set looks and feels like (energy, set length, crowd experience)
- Which Weezer albums/eras you cover

**Contact/Booking section** — add ~100 words:
- Venue capacity range you play
- Geographic reach (Austin + how far you travel)
- What's included / backline requirements
- Typical turnaround time for booking inquiries

This directly targets booking-intent queries like *"book weezer cover band Austin"*.

---

## Step 5 — Get Listed on Music Directories

**Why:** High-authority domains that rank for local music queries. Each listing is a backlink and independent discovery surface.

**Action — create/claim band profiles on:**
- **Do512** (`do512.com`) — already linked from past show URLs; create a permanent artist profile
- **Bandsintown** — embeddable widget for upcoming shows (add to Events section)
- **Songkick** — Google pulls this data for event rich results
- **Spotify** — if any original recordings exist; otherwise create an artist page linked to covers playlist

---

## Step 6 — Replace Satirical Testimonials with Real Reviews

**Why:** The Testimonials section subtitle reads "Totally real, completely unsponsored testimonials from actual Weezer fans." This is a direct trustworthiness penalty under Google's 2025 QRG — quality raters flag sections where review authenticity cannot be verified.

**Options:**
- Replace with real quotes from Do512 event comments, Google reviews, or fan messages — with attribution
- If keeping the humor, move jokes to a clearly labeled "Fan Fiction" section and add a separate genuine review block above it

**Do not add `Review` or `AggregateRating` schema** to the current testimonials — Google's review policies prohibit schema on non-genuine reviews.

---

## Step 7 — Submit to Google Search Console

**When:** Once `wrestlewithjimmy.com` is the live canonical domain (not the Heroku subdomain).

**Actions:**
1. Go to `https://search.google.com/search-console`
2. Add and verify the property for `https://wrestlewithjimmy.com`
3. Submit sitemap: `https://wrestlewithjimmy.com/sitemap.xml`
4. Request indexing for the homepage
5. Monitor the Coverage report for crawl errors

---

## Remaining Technical Items (Lower Priority)

### Gallery image alt text
All 18 Barton Springs photos share identical alt text; all 14 Radio East photos share identical alt text. Give each photo a unique description in `src/data/photos.js`.

### Image width/height attributes
All `<img>` tags in `Gallery.jsx` and `About.jsx` are missing `width` and `height` attributes, causing layout shift (CLS) as images load. Either add explicit dimensions or set `aspect-ratio` in CSS.

### Favicon
No `<link rel="icon">` declared. Create a 32x32 PNG or SVG from the logo and add to `index.html`.

### Security headers
The Express server has no security middleware. Add `helmet`:
```
npm install helmet
```
```js
// server/index.js
import helmet from 'helmet'
app.use(helmet())
```

### Contact form rate limiting
The `/api/contact` endpoint has no rate limiting. Add `express-rate-limit`:
```
npm install express-rate-limit
```

### Footer nav
Footer only links to 3 of 6 sections (About, Gallery, Book Us). Add Videos, Shows, Reviews to match the primary nav.

### "10+ Venues" stat
The About section shows "10+ Venues" but events data shows 13+ past venues. Either drive this number dynamically from `events.js` or update the copy manually.

### Update Event schema when shows change
The Event JSON-LD in `index.html` is hardcoded. When new shows are added to `src/data/events.js`, also update the schema block. Long-term, inject this dynamically from the events data to keep them in sync automatically.
