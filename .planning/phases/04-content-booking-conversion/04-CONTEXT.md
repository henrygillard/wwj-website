# Phase 4: Content & Booking Conversion - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform the site into a credible booking-conversion page for event bookers. Deliver: a 150-word booking pitch in the contact section, real venue-attributed testimonials (no satire framing), named band members with instruments, 600+ total homepage word count, complete footer nav (6 links), and accurate venue count stat. No new components, no routing changes, no new sections — only content expansion and structural tweaks to existing sections.

</domain>

<decisions>
## Implementation Decisions

### Content Update Path
- **D-01:** All text changes go through the Google Sheet → `npm run sync-content` → `src/data/content.js` pipeline. No direct edits to content.js.
- **D-02:** Structural changes (new data fields, component layout, computed values) go directly into source files (`sync-from-sheet.mjs`, `*.jsx`).

### Testimonials Rewrite (CONTENT-02)
- **D-03:** Replace the entire testimonials section — remove satire framing from section heading/subtitle, replace all 6 fake fan entries with venue-attributed placeholders using the **same data schema** (quote, name, handle, rating). The band fills in real quotes by editing the sheet.
- **D-04:** The `name` field becomes the venue/booker name (e.g., "Central Machine Works"), the `handle` field becomes the booker title/role (e.g., "Venue Coordinator"). Rating field stays for display; planner decides whether to show stars or drop them for the B2B framing.
- **D-05:** Section heading changes from "What the Stans Are Saying" to something credible for bookers (e.g., "What Venues Are Saying"). Section subtitle removes "Totally real, completely unsponsored" — replace with a straight description.

### Band Member Data (CONTENT-03)
- **D-06:** Add a `members` array to the About tab in the Google Sheet (new rows: Name, Instrument columns). Update `sync-from-sheet.mjs` to read those rows and output a `members` array on the `ABOUT` export. Render the member list in `About.jsx`.
- **D-07:** The planner writes placeholder entries (e.g., "Band Member 1 / Guitar") that the band replaces in the sheet.

### Booking Pitch (CONTENT-01)
- **D-08:** Add a `bookingPitch` field to the Contact tab in the Google Sheet. Update `sync-from-sheet.mjs` to read it. Render as a paragraph in `Contact.jsx` above the form.
- **D-09:** The pitch should cover: event types (venues, festivals, corporate events, private parties), capacity range, geography (Austin + surrounding areas + travel), set structure (length, Weezer-heavy + '90s alt rock), lead time, and direct email. Target: 150+ words in a single prose paragraph or short structured block.

### Venue Count (CONTENT-06)
- **D-10:** Compute the venue count **dynamically** in `About.jsx` by importing `EVENTS` from `../data/events.js` and counting unique venues via `new Set(EVENTS.map(e => e.venue)).size`. Current count: **11 unique venues** (13 events; Come and Take It Live × 2, Hole in the Wall × 2). The "10+ Venues" stat number is overridden at render time; stat label stays from the sheet.
- **D-11:** Display format: either exact count "11 Venues" or "11+" — planner decides based on how quickly it's likely to change. Currently 11, so "11+" is accurate and forward-looking.

### Footer Nav (CONTENT-05)
- **D-12:** Add the 3 missing nav links directly to `Footer.jsx` (hardcoded, not sheet-managed). Footer nav is structural.
- **D-13:** Link targets: Videos → `#video`, Shows → `#events`, Reviews → `#testimonials`. Final 6-link order: About, Gallery, Videos, Shows, Reviews, Book Us.

### Word Count Strategy (CONTENT-04)
- **D-14:** The 600+ word target is reached by combining: booking pitch (~150 words), expanded about paragraphs (existing ~90 words), member list (~20 words), testimonials with real quotes (~150-200 words for 3-4 quotes), shows section, hero copy. Agent should verify total with a word count after implementation.

### Claude's Discretion
- Exact wording of the new testimonials section heading and subtitle — within the constraint of removing satire framing and making it credible for bookers.
- Whether to retain star ratings in the testimonials display when switching to venue quotes (stars are fine for B2B if framing is professional).
- Exact format of the member list in About.jsx (inline sentence, bullet list, or named cards).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — CONTENT-01 through CONTENT-06 definitions and acceptance criteria
- `.planning/ROADMAP.md` §Phase 4 — success criteria (5 specific tests that must be TRUE)

### Content Data Flow
- `scripts/sync-from-sheet.mjs` — canonical sync script; all new sheet fields must be added here
- `src/data/content.js` — auto-generated; DO NOT edit by hand
- `src/data/events.js` — source of truth for venue count computation

### Key Components
- `src/components/Contact.jsx` — booking section; receives bookingPitch field
- `src/components/Testimonials.jsx` — testimonials section; data schema: quote, name, handle, rating
- `src/components/About.jsx` — about section; add member list render + dynamic venue count
- `src/components/Footer.jsx` — hardcode 3 missing nav links here

### Prior Phase Context
- `.planning/STATE.md` — accumulated key decisions, especially "content flows through Google Sheet → sync script → src/data/*.js"

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Testimonials.jsx` + `Testimonials.module.css` — existing testimonial card grid; `Stars` component already renders rating; reuse unchanged, just update content in sheet
- `About.jsx` stats map — already iterates `ABOUT.stats`; venue count override slots into this pattern
- `Footer.jsx` nav `<a>` elements — simple anchor tags; just add 3 more

### Established Patterns
- All text content: sheet tab → `parseKV` or row-loop in sync script → JSON export → component reads from `content.js` import
- Dynamic arrays in ABOUT: `stats` uses `while (aboutKV['Stat N number'])` loop — members can follow the same `while (aboutKV['Member N name'])` pattern
- Section IDs are already defined and stable: `#video`, `#events`, `#testimonials` are live targets

### Integration Points
- `sync-from-sheet.mjs` line ~66–82: About section assembly — add members loop after stats loop, add `members` to ABOUT object and to the content.js write string
- `sync-from-sheet.mjs` line ~115: Contact section assembly — add `bookingPitch: contactKV['Booking pitch']` to CONTACT object
- `About.jsx`: import EVENTS and compute venue count; substitute into the stats array before render
- `Footer.jsx` line ~11-15: nav `<a>` block — add Videos, Shows, Reviews anchors

</code_context>

<specifics>
## Specific Ideas

- Testimonials heading: something like "What Venues Are Saying" or "From the Bookers" — removes fan framing, signals B2B credibility
- Booking pitch must explicitly mention: direct email contact, event types (venues, festivals, corporate, private parties), geography, set length
- The band has played: Central Machine Works, Brisketfest (Far Out Lounge), Independence Brewing, Radio/East, Bungalow, Mohawk Austin, Hole in the Wall, Still Austin Whiskey Co., Come and Take It Live, Meanwhile Brewing, The Rock-Box — these venue names can appear in the booking pitch as social proof
- "10+ Venues" stat should resolve to "11 Venues" (exact) or "11+" (forward-looking) — either is accurate

</specifics>

<deferred>
## Deferred Ideas

- Adding `FOOTER_NAV` as a sheet-managed array (nav links editable from the sheet) — possible v2 enhancement, not needed for this milestone
- AggregateRating schema for testimonials — out of scope per REQUIREMENTS.md (testimonials must be genuine before schema is added)
- Band bio expansion beyond member list — could be a v2 content phase

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 4-Content & Booking Conversion*
*Context gathered: 2026-05-19*
