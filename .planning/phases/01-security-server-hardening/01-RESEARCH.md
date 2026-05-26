# Phase 1: Security & Server Hardening - Research

**Researched:** 2026-05-17
**Domain:** Express.js security middleware (Helmet, express-rate-limit, HTML escaping, cache-control)
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEC-01 | Express server sets security headers via Helmet (HSTS, X-Frame-Options, CSP, X-Content-Type-Options, Referrer-Policy) | Helmet 8.1.0 sets all five with `app.use(helmet())` — zero config needed for required headers; CSP needs one customization for Google Fonts |
| SEC-02 | /api/contact endpoint enforces rate limiting (max 10 requests per 15 minutes per IP) | express-rate-limit 8.5.2 handles this directly; requires `app.set('trust proxy', 1)` for Heroku IP detection |
| SEC-03 | User-supplied fields (name, email, inquiry, message) are HTML-escaped before insertion into the email template | Current HTML template in server/index.js interpolates raw user input; escape with a helper function using standard character replacement |
| SEC-04 | Hashed JS/CSS assets under /assets/ are served with cache-control: max-age=31536000, immutable | Express static `setHeaders` callback with path check against `/assets/` prefix; Vite outputs hashed filenames there by default |
</phase_requirements>

## Summary

Phase 1 is a pure server-side hardening pass on `server/index.js`. All four requirements map to well-established Node/Express patterns with mature libraries. No architectural changes are needed — this is additive middleware and one small string-escaping utility.

The two new packages are `helmet` (v8.1.0, sets 13+ security headers with one line) and `express-rate-limit` (v8.5.2, enforces per-IP request windows). Both support ESM `import` syntax, matching the project's `"type": "module"` setup. Both require Node >=16 — this server runs Node 22.22.3.

The most important non-obvious requirement is `app.set('trust proxy', 1)` before the rate limiter. Without it, Heroku's router strips the real client IP and all requests share the same internal IP, making rate limiting by IP ineffective. The Helmet CSP default blocks inline scripts — the existing `<script type="application/ld+json">` blocks in the pre-rendered HTML are inline and will be blocked unless CSP is relaxed for them.

**Primary recommendation:** Add `helmet`, `express-rate-limit`, and an inline `escapeHtml` utility to `server/index.js`. Set `trust proxy`, scope the rate limiter to `/api/contact` only, and override the `setHeaders` callback on `express.static` to add `Cache-Control: max-age=31536000, immutable` for `/assets/` paths.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Security headers (HSTS, X-Frame-Options, etc.) | API / Backend (Express middleware) | — | Headers are set at the server response layer; cannot be set client-side |
| Rate limiting | API / Backend (Express middleware) | — | Must be enforced server-side before handler executes |
| HTML escaping for email | API / Backend (contact handler) | — | Email is composed server-side; escaping must happen before template interpolation |
| Cache-Control for hashed assets | API / Backend (Express static middleware) | CDN / Static (future) | Express serves dist/ directly on Heroku; no CDN layer currently exists |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| helmet | 8.1.0 | Sets 13+ HTTP security headers via single middleware call | De facto standard for Express security; recommended by expressjs.com official docs; zero transitive dependencies |
| express-rate-limit | 8.5.2 | Per-IP request rate limiting with configurable window and max count | Most widely used Express rate limiter; no Redis required for single-dyno Heroku setup |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| he | 1.2.0 | Full Unicode HTML entity encode/decode | Use when escaping needs to handle non-ASCII characters or the full HTML entity spec; overkill for this use case but available |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| inline `escapeHtml` helper | `he` package | `he` is more complete; inline helper covers the 5 dangerous characters and is zero-dependency — better for a contact form with no exotic unicode requirements |
| express-rate-limit (in-memory) | rate-limiter-flexible + Redis | Redis adds infrastructure complexity not warranted for a single Heroku dyno; in-memory store resets on dyno restart (acceptable for abuse prevention, not precision billing) |
| helmet (all defaults) | manually setting headers with `res.setHeader` | Manual headers miss headers, get stale, have no defaults. Helmet is maintained and correct. |

**Installation:**
```bash
npm install helmet express-rate-limit
```

**Version verification:** Confirmed against npm registry on 2026-05-17.
- `helmet@8.1.0` — published 2025-03-17 [VERIFIED: npm registry]
- `express-rate-limit@8.5.2` — published 2026-05-14 [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```
Incoming HTTP request
        │
        ▼
  [Heroku Router]
  adds X-Forwarded-For
        │
        ▼
  [Express app]
  app.set('trust proxy', 1)  ← unlocks req.ip from X-Forwarded-For
        │
        ▼
  [helmet()]  ← sets all security headers on every response
        │
        ▼
        ├─── /assets/* ──────────────────────────────────────────────▶ express.static (dist/)
        │                                                                setHeaders: Cache-Control immutable
        │
        ├─── /api/contact ──▶ [contactLimiter]  ──▶ contact handler
        │                     10 req / 15 min / IP   escapeHtml() on
        │                     returns 429 on breach   name/email/inquiry/message
        │                                             before HTML template
        │
        └─── /* ─────────────────────────────────────────────────────▶ express.static (dist/)
                                                                        then SPA fallback (index.html)
```

### Recommended Project Structure

No new files or folders needed. All changes go in `server/index.js` and `package.json`.

```
server/
└── index.js     # Add: import helmet, rateLimit; add escapeHtml helper; wire middleware
package.json     # Add: helmet, express-rate-limit to dependencies
```

### Pattern 1: Helmet with CSP Override for JSON-LD Inline Scripts

**What:** The pre-rendered `dist/index.html` contains `<script type="application/ld+json">` blocks. Helmet's default CSP includes `script-src 'self'` which blocks inline scripts. JSON-LD blocks ARE inline scripts. The fix is to allow `'unsafe-inline'` for script-src, OR to use a nonce. For a static pre-rendered site where nonces cannot be injected per-request, the pragmatic fix is to disable CSP or loosen `script-src` to permit `'unsafe-inline'`. The site also loads fonts from `fonts.googleapis.com` and `fonts.gstatic.com` (confirmed in dist/index.html).

**When to use:** Always — the default CSP will break JSON-LD and Google Fonts loading.

```javascript
// Source: Context7 /helmetjs/helmet — CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],   // allows JSON-LD blocks
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://wwj-video-bucket.s3.us-east-2.amazonaws.com'],
        mediaSrc: ["'self'", 'https://wwj-video-bucket.s3.us-east-2.amazonaws.com'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
  })
)
```

**Note:** The S3 video URL (`wwj-video-bucket.s3.us-east-2.amazonaws.com`) must be in `mediaSrc` or the `<video>` element will be blocked. [VERIFIED: inspected src/data/assets.js and src/components/VideoSection.jsx]

### Pattern 2: Rate Limiter Scoped to /api/contact

**What:** Apply rate limiting only to the contact endpoint, not all routes. Requires `trust proxy` set first.

**When to use:** Any public form endpoint on Heroku.

```javascript
// Source: Context7 /express-rate-limit/express-rate-limit
import { rateLimit } from 'express-rate-limit'

app.set('trust proxy', 1)  // Heroku adds 1 proxy hop

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 10,                  // max 10 requests per window per IP
  standardHeaders: 'draft-6', // Return RateLimit-* headers
  legacyHeaders: false,       // Omit X-RateLimit-* headers
})

app.post('/api/contact', contactLimiter, async (req, res) => {
  // handler
})
```

### Pattern 3: Inline escapeHtml Helper

**What:** A simple 5-character replacement covers all HTML injection risks in email templates.

**When to use:** Any user input interpolated into an HTML string.

```javascript
// No external dependency needed — covers &, <, >, ", '
function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Usage in the contact handler:
const safeName    = escapeHtml(name)
const safeEmail   = escapeHtml(email)
const safeInquiry = escapeHtml(inquiryLabel)
const safeMessage = escapeHtml(message)

// html template uses safe* variables only
```

Note: The `text:` field in nodemailer does NOT need escaping — plain text is not rendered as HTML.

### Pattern 4: Cache-Control for Hashed Assets via setHeaders

**What:** Express `express.static` serves `dist/`. The `/assets/` subdirectory contains Vite-hashed filenames (`index-CE2T5aA-.js`, `index-CtqOItMb.css`). These filenames change on every build so they are safe to cache for one year.

**When to use:** Any content-hashed static asset path.

```javascript
// Source: expressjs.com/en/resources/middleware/serve-static.html
app.use(
  express.static(join(__dirname, '../dist'), {
    setHeaders(res, filePath) {
      if (filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      }
    },
  })
)
```

[VERIFIED: dist/index.html confirmed Vite outputs assets to `/assets/index-*.js` and `/assets/index-*.css`]

### Anti-Patterns to Avoid

- **Applying rate limiter globally with `app.use(limiter)`:** This rate-limits all routes including static file serving and the SPA fallback, degrading legitimate users browsing the site. Scope it to `/api/contact` only.
- **Setting `trust proxy` to `true` (boolean):** This trusts ALL proxy hops in X-Forwarded-For, enabling IP spoofing by clients who can set that header. Use `1` (number) to trust exactly one hop (the Heroku router).
- **Using Helmet's default CSP without review:** The default blocks `'unsafe-inline'` for scripts. The JSON-LD structured data blocks in the pre-rendered HTML are inline scripts and WILL be blocked, causing Google rich result loss. Always audit CSP against your actual HTML.
- **Escaping the plain text email body:** `text:` in nodemailer is delivered as plain text, not HTML. Escaping it would send literal `&lt;` characters to the recipient's inbox.
- **Using `path.extname` to detect hashed assets:** Vite hashes all assets regardless of extension. Matching on the `/assets/` path prefix is more reliable than trying to detect hashes via filename pattern.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Security headers | Custom `res.setHeader` calls for each header | `helmet` | 13 headers, correct values, maintained defaults, HSTS/CSP nuance is easy to get wrong |
| Rate limiting | Custom request counter with setTimeout | `express-rate-limit` | Handles race conditions, correct 429 response, standard RateLimit headers, sliding window edge cases |
| HTML entity encoding | Custom regex replace | Inline 5-char helper OR `he` package | The 5 dangerous chars (&, <, >, ", ') are well-known; an inline helper is the right scope for this use case |

**Key insight:** Security middleware accumulates edge cases that are invisible until exploited. Helmet and express-rate-limit are maintained by people who track CVEs; a hand-rolled version is not.

## Common Pitfalls

### Pitfall 1: Trust Proxy Not Set — Rate Limiter Applies to Heroku Internal IP
**What goes wrong:** Without `app.set('trust proxy', 1)`, `req.ip` returns the IP of the Heroku router (an internal address), not the end user's IP. All requests share the same key. The rate limiter blocks everyone after the 10th total request.
**Why it happens:** Express does not trust X-Forwarded-For headers by default to prevent IP spoofing.
**How to avoid:** Add `app.set('trust proxy', 1)` before any middleware that uses `req.ip`. Place it immediately after `const app = express()`.
**Warning signs:** Rate limiter triggers after exactly 10 requests regardless of requester; all rate-limit counts reset when the dyno restarts.

### Pitfall 2: Helmet Default CSP Breaks JSON-LD and Google Fonts
**What goes wrong:** `app.use(helmet())` with no options sets `script-src 'self'`. The pre-rendered HTML includes inline `<script type="application/ld+json">` blocks. These count as inline scripts and are blocked. The page loads but structured data is not executed by parsers expecting the tag content. Google Fonts CSS also loads from `fonts.googleapis.com`, blocked by the default `style-src`.
**Why it happens:** Helmet's defaults are conservative — they assume you will customize CSP for your app.
**How to avoid:** Override `contentSecurityPolicy.directives` as shown in Pattern 1. Add `'unsafe-inline'` to `script-src` (JSON-LD blocks pose no XSS risk as they contain data, not executable code in the normal sense, but the browser applies CSP to the tag type). Add Google Fonts origins to `fontSrc` and `styleSrc`.
**Warning signs:** Browser console shows CSP violations; structured data disappears from Google Rich Results Test after deploying; fonts fall back to system fonts.

### Pitfall 3: setHeaders Runs on EVERY Static File
**What goes wrong:** A `setHeaders` function that sets `Cache-Control: max-age=31536000, immutable` for ALL files will cache `index.html` for a year. Users will never see content updates.
**Why it happens:** `express.static` calls `setHeaders` for every file it serves, including HTML.
**How to avoid:** Check `filePath.includes('/assets/')` before setting the long cache header. Only `/assets/` contains content-hashed filenames. `index.html` and other files should use the default (no explicit Cache-Control, or `no-cache`).
**Warning signs:** After deploying a new build, users still see the old site because their browser cached `index.html` for a year.

### Pitfall 4: Escaping Only the HTML Body, Not All Fields
**What goes wrong:** Developer escapes `message` but forgets `name`, `email`, and `inquiry`. A malicious name like `<img src=x onerror=alert(1)>` renders in the HTML email.
**Why it happens:** The `message` field seems like the only "free text" input.
**How to avoid:** Escape ALL four user-supplied fields before inserting into the HTML template: `name`, `email`, `inquiry`, and `message`.
**Warning signs:** Sending a test submission with `<b>bold</b>` in the name field and seeing bold text in the received email.

## Code Examples

### Complete server/index.js Structure (after changes)

```javascript
// Source: Context7 /helmetjs/helmet + /express-rate-limit/express-rate-limit + expressjs.com serve-static
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const app = express()
const PORT = process.env.PORT || 3000

// Trust Heroku's single proxy hop — required for correct req.ip
app.set('trust proxy', 1)

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://wwj-video-bucket.s3.us-east-2.amazonaws.com'],
        mediaSrc: ["'self'", 'https://wwj-video-bucket.s3.us-east-2.amazonaws.com'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
  })
)

app.use(express.json())

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  limit: 10,
  standardHeaders: 'draft-6',
  legacyHeaders: false,
})

// Contact form → email
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, inquiry, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const inquiryLabel = inquiry || 'Not specified'

  // Escape all user-supplied fields before HTML insertion
  const safeName    = escapeHtml(name)
  const safeEmail   = escapeHtml(email)
  const safeInquiry = escapeHtml(inquiryLabel)
  const safeMessage = escapeHtml(message)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: `"WWJ Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `"${safeName}" <${safeEmail}>`,
      subject: `[WWJ Booking] ${safeInquiry} — ${safeName}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Inquiry: ${inquiryLabel}`,
        '',
        message,
      ].join('\n'),
      html: `
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Inquiry:</strong> ${safeInquiry}</p>
        <hr />
        <p style="white-space:pre-wrap">${safeMessage}</p>
      `,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('Mail error:', err)
    res.status(500).json({ error: 'Failed to send email.' })
  }
})

// Serve the built React app with cache-control for hashed assets
app.use(
  express.static(join(__dirname, '../dist'), {
    setHeaders(res, filePath) {
      if (filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      }
    },
  })
)

// SPA fallback — serve index.html for any route
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`WWJ server running at http://localhost:${PORT}`)
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `max` option in express-rate-limit | `limit` option | v7.0.0 (2023) | `max` still works as alias but `limit` is canonical |
| `standardHeaders: true` (boolean) | `standardHeaders: 'draft-6'` or `'draft-8'` (string) | v7.0.0 (2023) | String form selects IETF draft version; `true` still works, defaults to draft-6 |
| Helmet v6/v7 CJS `require('helmet')` | Helmet v8 dual CJS/ESM | v7+ | ESM `import helmet from 'helmet'` works without any workaround |

**Deprecated/outdated:**
- `helmet.xssFilter()`: Removed in Helmet 7. The `X-XSS-Protection` header is deprecated by browsers and no longer recommended. Do not add it manually.
- `express-rate-limit` `max` option: Still functional but deprecated. Use `limit` instead.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Heroku adds exactly 1 proxy hop to X-Forwarded-For, so `trust proxy: 1` is correct | Pitfall 1, Pattern 2 | If Heroku adds 2 hops, `req.ip` returns wrong address and rate limiting by IP fails silently. Low risk — Heroku documentation confirms 1 hop [CITED: devcenter.heroku.com/articles/http-routing] |
| A2 | `'unsafe-inline'` in script-src is acceptable because the site has no user-generated script execution paths | Pattern 1 | If the site later adds user content rendered as HTML, this weakens XSS protection. Acceptable at current scope. |
| A3 | The S3 video domain `wwj-video-bucket.s3.us-east-2.amazonaws.com` is stable and won't change | Pattern 1 (mediaSrc) | If bucket or region changes, video is blocked by CSP. Low risk for now. |

## Open Questions (RESOLVED)

1. **CSP strictness vs. JSON-LD compatibility**
   - What we know: Helmet blocks inline scripts by default; JSON-LD blocks are inline scripts; adding `'unsafe-inline'` weakens script-src protection
   - What's unclear: Whether Google's structured data parsers read JSON-LD via HTTP response headers (alternative) or only from inline script tags
   - RESOLVED: Use `'unsafe-inline'` for now (the site has no user-generated script paths, so the XSS risk is low). If a stricter CSP is desired in a future phase, JSON-LD can be moved to a separate file served with `application/ld+json` MIME type via a dedicated route, but that is out of scope for Phase 1.

2. **Rate limiter persistence across dyno restarts**
   - What we know: In-memory store resets when the Heroku dyno restarts or sleeps; the free/eco tier restarts frequently
   - What's unclear: Whether this matters for the business (a spammer who hits the limit can bypass it by waiting for a restart)
   - RESOLVED: In-memory store is acceptable for Phase 1. A persistent store (Redis) is a v2 concern if spam becomes a real problem.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All server code | Yes | 22.22.3 | — |
| npm | Package installation | Yes | 10.9.8 | — |
| helmet (not yet installed) | SEC-01 | No | — | None — must install |
| express-rate-limit (not yet installed) | SEC-02 | No | — | None — must install |

**Missing dependencies with no fallback:**
- `helmet` — not in package.json; must be installed (`npm install helmet`)
- `express-rate-limit` — not in package.json; must be installed (`npm install express-rate-limit`)

## Validation Architecture

No automated test framework is present in this project (no jest.config, vitest.config, test/ directory, or test script in package.json). The success criteria for this phase are verified manually via curl and browser inspection.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Command |
|--------|----------|-----------|---------|
| SEC-01 | Response includes HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy | Manual / smoke | `curl -I https://wrestlewithjimmy.com` — inspect response headers |
| SEC-02 | 11th request within 15 min from same IP returns 429 | Manual | `for i in {1..11}; do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"t","email":"t@t.com","message":"t"}'; done` |
| SEC-03 | `<script>` in name field appears escaped in received email | Manual | Submit form with `<script>alert(1)</script>` as name; inspect email source |
| SEC-04 | Request for `/assets/*.js` returns `Cache-Control: public, max-age=31536000, immutable` | Manual / smoke | `curl -I http://localhost:3000/assets/index-CE2T5aA-.js` (or equivalent hashed filename post-build) |

### Wave 0 Gaps
No test framework needs to be installed — all verification for this phase is curl/manual. No Wave 0 test files to create.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in this phase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | No access control |
| V5 Input Validation | Yes | Inline escapeHtml on all user fields |
| V6 Cryptography | No | No crypto operations |
| V14 HTTP Security Headers | Yes | helmet 8.1.0 |

### Known Threat Patterns for Express + Contact Form

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| HTML injection in email | Spoofing / Tampering | escapeHtml() on all user fields before HTML template |
| Contact form spam / DoS | Denial of Service | express-rate-limit, 10/15min per IP |
| Clickjacking | Tampering | X-Frame-Options: SAMEORIGIN (Helmet default) |
| MIME sniffing | Tampering | X-Content-Type-Options: nosniff (Helmet default) |
| Protocol downgrade | Tampering | HSTS max-age=31536000 (Helmet default) |
| Referrer leakage | Information Disclosure | Referrer-Policy (Helmet default: no-referrer) |
| XSS via response | Tampering | CSP (Helmet — customized per Pattern 1) |

## Sources

### Primary (HIGH confidence)
- Context7 `/helmetjs/helmet` — basic setup, HSTS, X-Frame-Options, CSP configuration, Referrer-Policy defaults [VERIFIED]
- Context7 `/express-rate-limit/express-rate-limit` — windowMs, limit, standardHeaders, keyGenerator, 429 behavior [VERIFIED]
- npm registry — helmet@8.1.0 (published 2025-03-17), express-rate-limit@8.5.2 (published 2026-05-14) [VERIFIED]
- expressjs.com/en/resources/middleware/serve-static.html — setHeaders, maxAge, immutable options [VERIFIED: WebFetch]
- devcenter.heroku.com/articles/http-routing — X-Forwarded-For behavior, 1 hop added by Heroku router [VERIFIED: WebFetch]

### Secondary (MEDIUM confidence)
- expressjs.com/en/advanced/best-practice-security.html — Helmet as recommended practice [CITED]
- helmetjs.github.io — default header list confirmed [CITED]

### Tertiary (LOW confidence)
- WebSearch: trust proxy = 1 for Heroku (confirmed by multiple community sources and Heroku docs, elevated to MEDIUM)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against npm registry; docs verified via Context7
- Architecture: HIGH — server/index.js fully read; dist/ output structure confirmed; no unknowns
- Pitfalls: HIGH — CSP/JSON-LD conflict verified by reading dist/index.html; trust proxy confirmed via Heroku docs
- CSP specifics: MEDIUM — exact directive list derived from reading actual source files; S3 domain confirmed from assets.js

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (express-rate-limit releases frequently; helmet is stable)
