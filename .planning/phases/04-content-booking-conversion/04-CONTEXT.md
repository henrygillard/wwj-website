# Phase 4: Content & Booking Conversion - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Add the 3 missing footer nav links so the footer shows all 6 sections (About, Gallery, Videos, Shows, Reviews, Book Us). This is the only change in scope for this phase. All other content requirements (booking copy, testimonials rewrite, band members, word count, venue count stat) are deferred to a future phase/TODO.

</domain>

<decisions>
## Implementation Decisions

### Footer Nav (CONTENT-05)
- **D-01:** Add the 3 missing nav links directly to `Footer.jsx` (hardcoded, not sheet-managed). Footer nav is structural, not content.
- **D-02:** Link targets: Videos → `#video`, Shows → `#events`, Reviews → `#testimonials`. Final 6-link order: About, Gallery, Videos, Shows, Reviews, Book Us.

### Claude's Discretion
- Order of the 6 links in the footer nav (suggested: About, Gallery, Videos, Shows, Reviews, Book Us).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — CONTENT-05 definition and acceptance criteria
- `.planning/ROADMAP.md` §Phase 4 — success criteria

### Key Components
- `src/components/Footer.jsx` — add the 3 missing nav links here
- Section IDs to link to: `#video` (VideoSection), `#events` (Events), `#testimonials` (Testimonials) — all exist in the live codebase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Footer.jsx` nav `<a>` elements — 3 simple anchor tags currently (About, Gallery, Book Us); add Videos, Shows, Reviews in the same style

### Established Patterns
- Footer nav links are hardcoded anchors in `Footer.jsx`; not sheet-managed. The FOOTER export in content.js contains only `tagline`.

### Integration Points
- `src/components/Footer.jsx` line ~11-15: nav `<a>` block — add Videos (`#video`), Shows (`#events`), Reviews (`#testimonials`) anchors

</code_context>

<specifics>
## Specific Ideas

- No special styling needed — match the existing `<a>` elements in the nav block
- Section IDs confirmed live: `#video` in VideoSection.jsx, `#events` in Events.jsx, `#testimonials` in Testimonials.jsx

</specifics>

<deferred>
## Deferred Ideas

The following CONTENT requirements are intentionally deferred to a future TODO/phase:

- **CONTENT-01** — Booking section expanded with ~150 words targeting event bookers
- **CONTENT-02** — Testimonials section reframed; real venue quotes, satire framing removed
- **CONTENT-03** — Band member names and instruments added to About section
- **CONTENT-04** — Total homepage word count reaches 600+
- **CONTENT-06** — "10+ Venues" stat updated to accurate count (currently 11 unique venues)

Also deferred:
- Sheet-managed footer nav links — not needed for this milestone
- AggregateRating schema for testimonials — requires genuine reviews first
- Band bio expansion beyond member list

</deferred>

---

*Phase: 4-Content & Booking Conversion*
*Context gathered: 2026-05-19*
