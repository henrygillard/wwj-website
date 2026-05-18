---
phase: 01-security-server-hardening
reviewed: 2026-05-18T00:00:00Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - server/index.js
  - package.json
findings:
  critical: 3
  warning: 3
  info: 2
  total: 8
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-05-18
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

This phase adds helmet, express-rate-limit, HTML escaping, and immutable asset caching to an Express.js server. The overall direction is sound, but three critical defects remain: email header injection is not blocked, the user-supplied email address is used unvalidated as an SMTP header value, and the JSON body parser has no size cap — making the server trivially DoS-able via large payloads regardless of the rate limiter. Three warnings cover a missing `HSTS` preload omission, the nodemailer transporter being re-created on every request, and the absence of input length limits. Two info items cover `'unsafe-inline'` in CSP and the loose `'*'` SPA catch-all.

---

## Critical Issues

### CR-01: Email Header Injection via Unvalidated `email` Field

**File:** `server/index.js:87`
**Issue:** `safeEmail` is HTML-escaped, but HTML escaping does not sanitize SMTP header values. A user can supply a value like:

```
foo@bar.com\r\nBcc: victim@example.com
```

This injects an extra SMTP header into the `replyTo:` field (line 87) and into the plain-text body (line 91 uses the raw `email` variable). `nodemailer` does strip some CRLF sequences, but relying on that undocumented behaviour is not a defence — the field needs format validation before it ever reaches the transport layer.

**Fix:** Validate that `email` matches a strict format before processing. Reject the request if it does not:

```js
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (!EMAIL_RE.test(email)) {
  return res.status(400).json({ error: 'Invalid email address.' })
}
```

Additionally, the `replyTo` value on line 87 should only include the validated email address directly, without embedding `safeName` into the RFC 5322 display-name position via a template literal, because `safeName` may still contain characters (e.g. `"`, `,`) that are significant in that header context.

---

### CR-02: No JSON Body Size Limit — Denial-of-Service Vector

**File:** `server/index.js:49`
**Issue:** `express.json()` is called with no options. By default it accepts up to 100 KB. While that sounds small, the rate limiter only protects `/api/contact` — all other routes (including the SPA fallback) process JSON bodies up to 100 KB with no throttle. More importantly, the intent of the rate limiter is to throttle contact-form abuse, but because the body is parsed before the rate-limiter middleware, every request (including rate-limited ones) fully parses the body before being rejected. A tighter explicit limit removes this pre-limiter parsing cost.

**Fix:** Set an explicit, minimal body size limit appropriate for the contact form:

```js
app.use(express.json({ limit: '4kb' }))
```

4 KB is generous for a name + email + inquiry + message form submission. This also ensures requests that exceed the limit fail fast with a 413 before any route handler runs.

---

### CR-03: `safeEmail` Used Raw Inside `mailto:` Attribute Href

**File:** `server/index.js:98`
**Issue:** Line 98 constructs:

```html
<a href="mailto:${safeEmail}">${safeEmail}</a>
```

HTML-escaping converts `<`, `>`, `&`, `"`, `'` — but it does not prevent a value like `attacker@x.com?subject=injected&body=injected` from being placed inside the `href`. Since this email is sent only to the site owner (not rendered in a browser context), the exploitability is low, but a malicious actor submitting a crafted contact form could influence the subject/body seen by the recipient when they click "Reply" from their mail client. This is a content-injection issue in the outgoing email, not an XSS in a browser.

**Fix:** After the `EMAIL_RE` validation in CR-01, additionally strip or reject any URL query string characters before constructing the `mailto:` href, or encode the email for URI context:

```js
const hrefEmail = encodeURIComponent(safeEmail)
// then use: <a href="mailto:${hrefEmail}">${safeEmail}</a>
```

---

## Warnings

### WR-01: No Input Length Limits — Facilitates Spam and Partial DoS

**File:** `server/index.js:61-73`
**Issue:** `name`, `email`, `inquiry`, and `message` are validated for presence (`!name || !email || !message`) but not for length. A sender can submit a 100 KB `message` string (within the body size limit), which will be fully HTML-escaped and emailed. This wastes memory building the escaped string and sends oversized emails. Combined with 10 requests per 15 minutes per IP, this allows ~1 MB of email content to be delivered per window per IP.

**Fix:** Add maximum-length guards after the presence check:

```js
if (name.length > 100 || email.length > 254 || message.length > 4000) {
  return res.status(400).json({ error: 'Input exceeds maximum length.' })
}
```

---

### WR-02: nodemailer Transporter Created on Every Request

**File:** `server/index.js:75-81`
**Issue:** `nodemailer.createTransport(...)` is called inside the route handler, so a new transport object (with its connection pool) is instantiated for every `/api/contact` POST. This is wasteful and may cause connection exhaustion under load since each transporter instance manages its own SMTP pool.

**Fix:** Hoist the transporter to module scope, created once at startup:

```js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})
```

---

### WR-03: HSTS `preload` and `includeSubDomains` Not Set

**File:** `server/index.js:29-47`
**Issue:** helmet's default HSTS sets `max-age=15552000` (180 days) without `includeSubDomains` or `preload`. For a production site on Heroku this is fine operationally, but helmet 8.x defaults do not include `preload`, which means browsers that have never visited the site are not protected on first visit. Since this phase explicitly configures CSP, it is reasonable to also explicitly configure HSTS.

**Fix:** Add an explicit HSTS directive within the helmet config:

```js
helmet({
  hsts: {
    maxAge: 31536000,        // 1 year
    includeSubDomains: true,
    preload: true,
  },
  contentSecurityPolicy: { ... }
})
```

Note: `preload: true` only takes effect after submitting your domain to the HSTS preload list.

---

## Info

### IN-01: `'unsafe-inline'` in `scriptSrc` Weakens CSP

**File:** `server/index.js:34`
**Issue:** `scriptSrc: ["'self'", "'unsafe-inline'"]` allows any inline `<script>` tag to execute. This negates most of the XSS protection that CSP provides. If the React build injects inline scripts (a common Vite output), the right fix is a per-request nonce or switching to `'strict-dynamic'` rather than blanket `'unsafe-inline'`.

**Fix:** Evaluate whether the built output actually requires inline scripts. Run `grep -r "<script" dist/` after a production build. If only hashed inline scripts are present, replace `'unsafe-inline'` with the specific `'sha256-...'` hash(es). If a nonce-based approach is feasible, use helmet's `contentSecurityPolicy` nonce support.

---

### IN-02: SPA Catch-All `app.get('*', ...)` Intercepts All Unmatched Methods

**File:** `server/index.js:124`
**Issue:** `app.get('*', ...)` only matches GET requests, so a `POST /anything-unknown` returns a 404 from Express rather than the SPA shell. This is probably the intended behaviour, but it means `POST /api/nonexistent` returns a bare Express 404 with a body that exposes framework information (the default Express HTML 404 page). Consider adding a generic JSON 404 handler.

**Fix:**

```js
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' })
})
```

Place this after the `app.get('*', ...)` route to catch non-GET unmatched routes.

---

_Reviewed: 2026-05-18_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
