# Phase 3: Image Performance & CWV — Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 7 new/modified files
**Analogs found:** 6 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `scripts/convert-images.mjs` | utility/script | file-I/O, batch | `scripts/prerender.mjs` | role-match |
| `scripts/verify-images.mjs` | utility/script | file-I/O, batch | `scripts/prerender.mjs` | role-match |
| `scripts/sync-from-sheet.mjs` | utility/script | batch, transform | self (patch only) | exact |
| `src/data/photos.js` | data | transform | self (regenerated) | exact |
| `src/components/Gallery.jsx` | component | request-response | self (patch only) | exact |
| `src/components/About.jsx` | component | request-response | self (patch only) | exact |
| `src/components/Hero.jsx` | component | request-response | self (patch only) | exact |
| `src/components/VideoSection.jsx` | component | request-response | self (patch only) | exact |
| `src/components/Nav.jsx` | component | request-response | self (patch only) | exact |
| `src/components/About.module.css` | config/style | transform | self (patch only) | exact |
| `index.html` | config/static | request-response | self (patch only) | exact |

---

## Pattern Assignments

### `scripts/convert-images.mjs` (utility/script, file-I/O batch) — NEW

**Analog:** `scripts/prerender.mjs`

**Script header + imports pattern** (`scripts/prerender.mjs` lines 1-11):
```javascript
/**
 * Pre-render script — runs after vite build + ssr build.
 * ...
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
```
Copy this header/import style: JSDoc block comment, bare `node:` prefix imports, `__dirname` via `fileURLToPath`, resolve paths relative to `__dirname`.

**Error exit pattern** (`scripts/prerender.mjs` lines 14-18):
```javascript
if (!fs.existsSync(bundlePath)) {
  console.error('SSR bundle not found at', bundlePath)
  console.error('Run `vite build --config vite.config.ssr.js` first.')
  process.exit(1)
}
```
Use `process.exit(1)` on fatal precondition failures. Log clear human-readable error before exit.

**Completion log pattern** (`scripts/prerender.mjs` line 28):
```javascript
console.log('Pre-render complete — content injected into dist/index.html')
```
Single `console.log` on success with em-dash separator — matches project style across all scripts.

**sharp import and core conversion pattern** (from RESEARCH.md — no existing analog in codebase):
```javascript
import sharp from 'sharp'
import { readdir, unlink } from 'node:fs/promises'
import { resolve, extname, basename, dirname } from 'node:path'

async function convertToWebP(inputPath, maxWidth, quality = 75) {
  const dir = dirname(inputPath)
  const base = basename(inputPath, extname(inputPath))
  const outputPath = resolve(dir, `${base}.webp`)

  const info = await sharp(inputPath)
    .resize(maxWidth, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath)

  return { outputPath, width: info.width, height: info.height, size: info.size }
}
```

**photos.js write pattern** (`scripts/sync-from-sheet.mjs` lines 191-196):
```javascript
const photosJs =
  `// Auto-generated — do not edit by hand.\n` +
  `// Run \`npm run sync-content\` to pull updates from Google Sheets.\n\n` +
  `export const allPhotos = ${JSON.stringify(photoItems, null, 2)}\n`

writeFileSync(resolve(__dirname, '../src/data/photos.js'), photosJs)
console.log('✓ src/data/photos.js updated')
```
Preserve the auto-generated header comment exactly. Use `JSON.stringify(items, null, 2)` for readable output. Use `✓` prefix on success lines — matches sync script's console style.

---

### `scripts/verify-images.mjs` (utility/script, file-I/O batch) — NEW

**Analog:** `scripts/prerender.mjs`

**Same script structure pattern** as `convert-images.mjs` above (JSDoc header, `node:` imports, `__dirname`, `process.exit(1)` on failure, single success log). The verify script is a read-only checker — it should `process.exit(1)` with a summary of failures if any WebP file is missing or over-size, `process.exit(0)` on clean pass.

**File size check pattern** — no existing analog; use Node `fs.statSync(path).size` (bytes) compared against per-category thresholds:
- hero-1.webp: 100 KB = 102400 bytes
- all others: 120 KB = 122880 bytes

---

### `scripts/sync-from-sheet.mjs` (utility/script, batch transform) — PATCH

**Analog:** self

**Current photos push pattern** (`scripts/sync-from-sheet.mjs` lines 163-166):
```javascript
if (row[0].startsWith('/') || row[0].startsWith('http')) {
  photoItems.push({ src: row[0], alt: row[1] ?? '', group: row[2] ?? '' })
}
```

**Patched pattern** — replace line 165 only:
```javascript
if (row[0].startsWith('/') || row[0].startsWith('http')) {
  photoItems.push({
    src: row[0].replace(/\.jpg$/i, '.webp'),  // normalise extension — Phase 3
    alt: row[1] ?? '',
    group: row[2] ?? ''
  })
}
```
Keep the surrounding guard condition and object shape identical. Add inline comment noting the normalisation and which phase introduced it.

---

### `src/data/photos.js` (data, transform) — REGENERATED by script

**Analog:** self (current file, lines 1-9)

**Current entry shape** (`src/data/photos.js` lines 4-9):
```javascript
export const allPhotos = [
  {
    "src": "/photos/barton-springs/DSC06956.jpg",
    "alt": "Wrestle With Jimmy — Barton Springs promo shoot, Austin TX",
    "group": "bartonSprings"
  },
```

**Target entry shape** (add `width` and `height` fields, update `.jpg` to `.webp`):
```javascript
export const allPhotos = [
  {
    "src": "/photos/barton-springs/DSC06956.webp",
    "alt": "Wrestle With Jimmy — Barton Springs promo shoot, Austin TX",
    "group": "bartonSprings",
    "width": 800,
    "height": 533
  },
```
The `width` and `height` values come from `sharp`'s `.toFile()` return object (`info.width`, `info.height`) — they reflect the post-resize intrinsic dimensions, not CSS display dimensions.

---

### `src/components/Gallery.jsx` (component, request-response) — PATCH

**Analog:** self

**Current `<img>` pattern** (`src/components/Gallery.jsx` line 36):
```jsx
<img src={photo.src} alt={photo.alt} loading="lazy" />
```

**Patched pattern** — add `width` and `height` from data:
```jsx
<img
  src={photo.src}
  alt={photo.alt}
  width={photo.width}
  height={photo.height}
  loading="lazy"
/>
```
No other changes to Gallery.jsx. The `width`/`height` attributes are numeric (not strings) — pass them as JSX expressions `{photo.width}` not string literals.

---

### `src/components/About.jsx` (component, request-response) — PATCH

**Analog:** self

**Current hardcoded paths + img pattern** (`src/components/About.jsx` lines 4-5, 28-39):
```jsx
const hero1 = '/photos/barton-springs/hero-1.jpg'
const hero2 = '/photos/barton-springs/hero-2.jpg'

// ...
<img
  src={hero1}
  alt="Wrestle With Jimmy performing live in Austin, TX"
  loading="lazy"
  onClick={() => onOpenPhoto(hero1)}
/>
<img
  src={hero2}
  alt="Wrestle With Jimmy on stage at a Weezer tribute show"
  loading="lazy"
  onClick={() => onOpenPhoto(hero2)}
/>
```

**Patched pattern** — update extensions and add `width`/`height`:
```jsx
const hero1 = '/photos/barton-springs/hero-1.webp'
const hero2 = '/photos/barton-springs/hero-2.webp'

// ...
<img
  src={hero1}
  alt="Wrestle With Jimmy performing live in Austin, TX"
  width={800}
  height={1200}
  loading="lazy"
  onClick={() => onOpenPhoto(hero1)}
/>
<img
  src={hero2}
  alt="Wrestle With Jimmy on stage at a Weezer tribute show"
  width={800}
  height={1200}
  loading="lazy"
  onClick={() => onOpenPhoto(hero2)}
/>
```
Dimensions are based on resize target (1200 px wide for hero-2; hero-1 resized to 1920 px wide per PERF-01). Exact post-conversion dimensions must be confirmed from `sharp` output and used here — the values above are estimates based on aspect ratio; update after conversion.

---

### `src/components/Hero.jsx` (component, request-response) — PATCH

**Analog:** self

**Current video poster** (`src/components/Hero.jsx` line 11):
```jsx
poster="/photos/barton-springs/hero-1.jpg"
```

**Patched value:**
```jsx
poster="/photos/barton-springs/hero-1.webp"
```
No other changes. The `poster` path must exactly match the `href` in the `<link rel="preload">` added to `index.html` — update both in the same edit to avoid a wasted preload fetch.

---

### `src/components/VideoSection.jsx` (component, request-response) — PATCH

**Analog:** self

**Current video poster** (`src/components/VideoSection.jsx` line 13):
```jsx
poster="/photos/barton-springs/hero-1.jpg"
```

**Patched value:**
```jsx
poster="/photos/barton-springs/hero-1.webp"
```
No other changes to this file.

---

### `src/components/Nav.jsx` (component, request-response) — PATCH

**Analog:** self

**Current logo img** (`src/components/Nav.jsx` line 13):
```jsx
<img src={logos.whiteTransparent} alt="WWJ" className={styles.logoImg} />
```

**Patched pattern** — add explicit dimensions:
```jsx
<img src={logos.whiteTransparent} alt="WWJ" className={styles.logoImg} width={110} height={110} />
```
The logo is a PNG (out of scope for WebP conversion this phase). The `110`×`110` values match the CSS `height: 110px` rule and the logo's confirmed square aspect ratio. No path change required.

---

### `src/components/About.module.css` (style, transform) — PATCH

**Analog:** self

**Current CSS background reference** (`src/components/About.module.css` line 5):
```css
url('/photos/radio-east/cover-image.jpg') no-repeat center center / cover;
```

**Patched value:**
```css
url('/photos/radio-east/cover-image.webp') no-repeat center center / cover;
```
Change only the filename extension. All surrounding `linear-gradient`, `no-repeat`, `center center / cover` values remain identical.

---

### `index.html` (static HTML, request-response) — PATCH

**Analog:** self

**Current `.jpg` references** (`index.html` lines 16, 22, 34):
```html
<meta property="og:image" content="https://wrestlewithjimmy.com/photos/barton-springs/hero-1.jpg" />
<meta name="twitter:image" content="https://wrestlewithjimmy.com/photos/barton-springs/hero-1.jpg" />
"image": "https://wrestlewithjimmy.com/photos/barton-springs/hero-1.jpg",
```

**Patched values** — all three updated to `.webp`:
```html
<meta property="og:image" content="https://wrestlewithjimmy.com/photos/barton-springs/hero-1.webp" />
<meta name="twitter:image" content="https://wrestlewithjimmy.com/photos/barton-springs/hero-1.webp" />
"image": "https://wrestlewithjimmy.com/photos/barton-springs/hero-1.webp",
```

**LCP preload hint to add** — insert after `<link rel="canonical">` (`index.html` line 8):
```html
<link rel="canonical" href="https://wrestlewithjimmy.com/" />
<link rel="preload" as="image" href="/photos/barton-springs/hero-1.webp" fetchpriority="high" />
```
The `href` path must exactly match the `poster` attribute in both `Hero.jsx` and `VideoSection.jsx`. After editing, run `grep -c 'hero-1\.jpg' index.html` — result must be `0`.

---

## Shared Patterns

### Node ESM Script Structure
**Source:** `scripts/prerender.mjs` (lines 1-11, 28)
**Apply to:** `scripts/convert-images.mjs`, `scripts/verify-images.mjs`
```javascript
/**
 * [Description of what the script does.]
 * [Usage line.]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ... script body ...

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```
All scripts in this project are ESM (`.mjs`), use `node:` import prefix, derive `__dirname` via `fileURLToPath`, and wrap their logic in a `main()` async function with `.catch()` at the bottom. The `sync-from-sheet.mjs` file (lines 235-238) confirms this is the universal script tail pattern.

### Auto-Generated File Header
**Source:** `scripts/sync-from-sheet.mjs` (lines 176-178); `src/data/photos.js` (lines 1-2)
**Apply to:** `src/data/photos.js` (regenerated output)
```javascript
// Auto-generated — do not edit by hand.
// Run `npm run sync-content` to pull updates from Google Sheets.
```
Any file written by a script must carry this two-line header. The convert script regenerating `photos.js` should preserve this header verbatim.

### Console Progress Style
**Source:** `scripts/sync-from-sheet.mjs` (lines 188, 196, 214)
**Apply to:** `scripts/convert-images.mjs`, `scripts/verify-images.mjs`
```javascript
console.log('✓ src/data/photos.js updated')
console.log('✓ src/data/events.js updated')
```
Use `✓` prefix for success lines. Use `console.error(...)` + `process.exit(1)` for failures. No intermediate verbose logging unless it conveys actionable info (e.g., per-file size after conversion).

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `scripts/convert-images.mjs` | utility/script | file-I/O, batch | No image processing script exists in codebase; sharp API patterns come from RESEARCH.md |
| `scripts/verify-images.mjs` | utility/script | file-I/O, batch | No test/verify scripts exist in this project; structure mirrors prerender.mjs but logic has no analog |

---

## Metadata

**Analog search scope:** `scripts/`, `src/components/`, `src/data/`, `index.html`
**Files scanned:** 11
**Pattern extraction date:** 2026-05-18
