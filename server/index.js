import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Contact form → email
app.post('/api/contact', async (req, res) => {
  const { name, email, inquiry, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  const inquiryLabel = inquiry || 'Not specified'

  try {
    await transporter.sendMail({
      from: `"WWJ Website" <${process.env.GMAIL_USER}>`,
      to: 'wrestlewithjimmyatx@gmail.com',
      replyTo: `"${name}" <${email}>`,
      subject: `[WWJ Booking] ${inquiryLabel} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Inquiry: ${inquiryLabel}`,
        '',
        message,
      ].join('\n'),
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Inquiry:</strong> ${inquiryLabel}</p>
        <hr />
        <p style="white-space:pre-wrap">${message}</p>
      `,
    })

    res.json({ ok: true })
  } catch (err) {
    console.error('Mail error:', err)
    res.status(500).json({ error: 'Failed to send email.' })
  }
})

// Serve the built React app
app.use(express.static(join(__dirname, '../dist')))

// SPA fallback — serve index.html for any route
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`WWJ server running at http://localhost:${PORT}`)
})
