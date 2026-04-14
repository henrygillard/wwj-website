# Content Management

Site content is managed via a Google Sheet and synced into source files before each deploy.

## Google Sheet

**URL:** https://docs.google.com/spreadsheets/d/1T0McDXR7VJ_Af1S8erm59_cqTGWvJoJ8_WYbjK0RoNk/edit

**Service account:** `www-10@wwj-website.iam.gserviceaccount.com`

The sheet has 7 tabs, one per site section:

| Tab | What it controls |
|-----|-----------------|
| **Hero** | Eyebrow, title, subtitle, CTA button labels/links, scroll hint |
| **About** | Section label, heading, two body paragraphs, stat cards |
| **Testimonials** | All 6 fan quotes (quote, name, handle, rating) + section labels |
| **Shows** | All show listings (date, venue, location, ticket URL, upcoming flag) + section labels |
| **Contact** | All form labels, placeholders, inquiry dropdown options, button text, success/error messages |
| **Footer & Nav** | Footer tagline, nav link labels |
| **Photos** | All gallery photos (src path, alt text, group) + section labels |

## How it works

1. Someone edits the Google Sheet
2. A developer runs `npm run sync-and-deploy`
3. The sync script reads the sheet via the Google Sheets API and overwrites two source files:
   - `src/data/content.js` — all text content (hero, about, testimonials, contact, footer, shows section labels)
   - `src/data/events.js` — show listings array
4. The script commits the updated files, pushes to GitHub, then pushes to Heroku
5. Heroku runs `npm run build` (Vite + SSR prerender) and relaunches the server

## Files

```
scripts/sync-from-sheet.mjs   — reads the sheet, writes content.js, events.js, and photos.js
src/data/content.js           — auto-generated, do not edit by hand
src/data/events.js            — auto-generated, do not edit by hand
src/data/photos.js            — auto-generated, do not edit by hand
```

All React components import from these files — no content is hardcoded in components.

## Auth setup

The sync script authenticates with a Google service account. The JSON key file lives at `.google-credentials.json` in the project root (gitignored).

`.env` must contain:
```
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=.google-credentials.json
```

To get the key file: Google Cloud Console → IAM → Service Accounts → `www-10@wwj-website.iam.gserviceaccount.com` → Keys → Add Key → JSON. Save the downloaded file as `.google-credentials.json`.

## Commands

```bash
npm run sync-content       # pull sheet → update content.js + events.js (no deploy)
npm run sync-and-deploy    # pull sheet → commit → push to GitHub + Heroku
```

## Shows tab format

Each show row has 5 columns:

| Date (YYYY-MM-DD) | Venue | Location | Ticket URL | Upcoming? |
|---|---|---|---|---|
| 2026-05-23 | The Rock-Box | San Antonio, TX | https://... | TRUE |

Set **Upcoming?** to `TRUE` for future shows, `FALSE` for past shows. The site automatically splits them into upcoming and past sections.

## Photos tab format

Each photo row has 3 columns:

| Src | Alt | Group |
|-----|-----|-------|
| /photos/barton-springs/DSC06956.jpg | Wrestle With Jimmy — Barton Springs promo shoot, Austin TX | bartonSprings |

- **Src**: path to the image (must start with `/` or `http`). Images are served from the `public/photos/` folder.
- **Alt**: descriptive alt text for accessibility.
- **Group**: optional tag for grouping (e.g. `bartonSprings`, `radioEast`) — not shown in the UI but available for future filtering.

Add or remove rows freely — the gallery renders all photos and paginates them. The metadata rows at the bottom must stay in place:

| Key | Value |
|-----|-------|
| Section label | Photos |
| Section heading | Live Photos |

## Adding/removing testimonials

Each testimonial row in the **Testimonials** tab has 4 columns: `Quote`, `Name`, `Handle`, `Rating`. Add or delete rows freely — the site renders however many exist. The section metadata rows at the bottom of the tab (Section label, Section heading, Section subtitle) must stay in place.
