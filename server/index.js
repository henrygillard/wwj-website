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
