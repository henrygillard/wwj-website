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

// Redirect HTTP → HTTPS and www → non-www (301 permanent)
app.use((req, res, next) => {
  const host = req.hostname
  const isHttps = req.headers['x-forwarded-proto'] === 'https'
  const isWww = host.startsWith('www.')

  if (!isHttps || isWww) {
    return res.redirect(301, `https://${isWww ? host.slice(4) : host}${req.url}`)
  }
  next()
})

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        imgSrc: [
          "'self'",
          'data:',
          'https://wwj-video-bucket.s3.us-east-2.amazonaws.com',
          // Spotify embed serves album art from its own image CDN
          'https://i.scdn.co',
          'https://image-cdn-ak.spotifycdn.com',
          'https://image-cdn-fa.spotifycdn.com',
        ],
        mediaSrc: ["'self'", 'https://wwj-video-bucket.s3.us-east-2.amazonaws.com'],
        connectSrc: ["'self'"],
        // Scoped to the two embed hosts we actually use — without this the
        // setlist player and promo video are blocked, since frameSrc otherwise
        // falls back to defaultSrc 'self'.
        frameSrc: [
          "'self'",
          'https://open.spotify.com',
          'https://www.youtube-nocookie.com',
        ],
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

// The site is a single route ("/") plus in-page #anchors, which never reach the
// server. An SPA catch-all here would answer every unknown path with the
// homepage at HTTP 200 — a soft 404 that search engines index as a duplicate.
// Serve a real 404 instead.
app.use((req, res) => {
  // Unknown /api/* paths should fail as JSON, not HTML.
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.status(404).sendFile(join(__dirname, '../dist/404.html'))
})

app.listen(PORT, () => {
  console.log(`WWJ server running at http://localhost:${PORT}`)
})
