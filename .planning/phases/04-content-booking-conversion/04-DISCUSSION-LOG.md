# Phase 4: Content & Booking Conversion - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 4-Content & Booking Conversion
**Mode:** --auto (all decisions auto-selected; no interactive prompts)
**Areas discussed:** Content update path, Testimonials rewrite strategy, Band member data structure, Booking pitch placement, Venue count computation, Footer nav links

---

## Content Update Path

| Option | Description | Selected |
|--------|-------------|----------|
| Google Sheet + sync | Text changes go through the sheet; sync regenerates content.js | ✓ |
| Direct file edits | Edit content.js or JSX directly for content changes | |

**Auto choice:** Google Sheet + sync for text; direct JSX/mjs edits for structural changes (new fields, computed values).
**Notes:** Locked prior decision from STATE.md. Structural changes (new fields in sync script, component logic) still go to source files.

---

## Testimonials Rewrite Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Replace section entirely | Remove satire framing; swap all entries to venue-attributed format | ✓ |
| Keep satire + add real section | Retain fan humor; add a separate "From the Venues" block | |
| Replace only 2 entries | Meet CONTENT-02 minimum; leave remaining satire slots | |

**Auto choice:** Replace section entirely — remove satire heading/subtitle, replace all entries with venue-attributed placeholders using existing schema.
**Notes:** CONTENT-02 requires "no 'Totally real, completely unsponsored' framing visible." Full replacement is cleaner and more credible for the booking-conversion goal.

---

## Band Member Data Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Sheet members rows + sync update | New Member N name/instrument rows in About tab; sync script reads them | ✓ |
| Hardcode in About.jsx | Write member names directly into the component | |

**Auto choice:** Sheet + sync pattern — consistent with how stats rows work (same `while (aboutKV['Member N name'])` pattern). Planner writes placeholder entries.
**Notes:** Allows band to update members via the sheet without code changes.

---

## Booking Pitch Placement

| Option | Description | Selected |
|--------|-------------|----------|
| New field in Contact tab + sync | `bookingPitch` field in sheet; rendered as paragraph in Contact.jsx above form | ✓ |
| Hardcoded in Contact.jsx | Write the 150-word pitch directly in JSX | |

**Auto choice:** Sheet-managed `bookingPitch` field — keeps booking copy editable by the band without code changes.
**Notes:** The planner writes the initial 150-word pitch in the sheet data; band can refine from the sheet later.

---

## Venue Count Computation

| Option | Description | Selected |
|--------|-------------|----------|
| Compute dynamically from events.js | Import EVENTS; count unique venues via Set; override stat at render time | ✓ |
| Update hardcoded number in sheet | Change "10+" to "11+" in the About sheet tab | |

**Auto choice:** Dynamic computation — never drifts as events are added.
**Notes:** Current unique venue count from events.js is 11 (13 events; Come and Take It Live × 2, Hole in the Wall × 2). Display as "11+" to stay accurate as shows are added.

---

## Footer Nav Links

| Option | Description | Selected |
|--------|-------------|----------|
| Hardcode in Footer.jsx | Add Videos, Shows, Reviews anchor tags directly to Footer.jsx | ✓ |
| Make sheet-managed | Extend Footer & Nav tab + sync to output a NAV_LINKS array | |

**Auto choice:** Hardcode in Footer.jsx — nav links are structural, not content. No benefit to sheet-managing them for this milestone.
**Notes:** Links: Videos → `#video`, Shows → `#events`, Reviews → `#testimonials`. Final order: About, Gallery, Videos, Shows, Reviews, Book Us.

---

## Claude's Discretion

- Exact wording of new testimonials section heading and subtitle
- Whether to show star ratings in the venue-testimonials display
- Format of member list in About.jsx (inline sentence, bullet, or card)

## Deferred Ideas

- Sheet-managed nav links — possible v2 enhancement
- AggregateRating schema for testimonials (requires genuine reviews; out of scope per REQUIREMENTS.md)
- Band bio expansion beyond member list
