/**
 * Syncs content from Google Sheets into src/data/content.js and src/data/events.js.
 * Usage: npm run sync-content
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY in .env (the full JSON key as a single-line string).
 */

import { google } from 'googleapis'
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SPREADSHEET_ID = '1T0McDXR7VJ_Af1S8erm59_cqTGWvJoJ8_WYbjK0RoNk'

async function main() {
  let credentials
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
    const { readFileSync } = await import('node:fs')
    const keyPath = resolve(__dirname, '..', process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE)
    credentials = JSON.parse(readFileSync(keyPath, 'utf-8'))
  } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
  } else {
    console.error('Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE (path to JSON) or GOOGLE_SERVICE_ACCOUNT_KEY (inline JSON) in .env')
    process.exit(1)
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  const [heroRows, aboutRows, testimonialsRows, showsRows, contactRows, footerNavRows, photosRows] =
    await Promise.all([
      readTab(sheets, 'Hero!A:B'),
      readTab(sheets, 'About!A:B'),
      readTab(sheets, 'Testimonials!A:D'),
      readTab(sheets, 'Shows!A:E'),
      readTab(sheets, 'Contact!A:B'),
      readTab(sheets, 'Footer & Nav!A:C'),
      readTab(sheets, 'Photos!A:C'),
    ])

  // Shows tab: data rows (have 5 columns) vs section label rows (2 columns, col A doesn't start with a date)
  const showsDataRows = showsRows.slice(1).filter((r) => r[0] && /^\d{4}-/.test(r[0]))
  const showsMetaRows = showsRows.filter((r) => r[0] && !/^\d{4}-/.test(r[0]) && r[0] !== 'Date')

  // --- Hero ---
  const heroKV = parseKV(heroRows)
  const HERO = {
    eyebrow: heroKV['Eyebrow'],
    title: heroKV['Title'],
    titleScreenReader: heroKV['Title (screen reader)'],
    subtitleLine1: heroKV['Subtitle line 1'],
    subtitleLine2: heroKV['Subtitle line 2'],
    cta1Label: heroKV['CTA Button 1'],
    cta1Link: heroKV['CTA Button 1 link'],
    cta2Label: heroKV['CTA Button 2'],
    cta2Link: heroKV['CTA Button 2 link'],
    scrollHint: heroKV['Scroll hint'],
  }

  // --- About ---
  const aboutKV = parseKV(aboutRows)
  const stats = []
  let i = 1
  while (aboutKV[`Stat ${i} number`]) {
    stats.push({ number: aboutKV[`Stat ${i} number`], label: aboutKV[`Stat ${i} label`] })
    i++
  }
  const ABOUT = {
    sectionLabel: aboutKV['Section label'],
    heading: aboutKV['Heading'],
    paragraph1: aboutKV['Paragraph 1'],
    paragraph2: aboutKV['Paragraph 2'],
    stats,
  }

  // --- Testimonials ---
  // Rows: header row, then testimonial rows (col D = numeric rating),
  // then blank row, then section metadata rows.
  const testimonialItems = []
  const testimonialMeta = {}
  for (const row of testimonialsRows.slice(1)) {
    if (!row[0]) continue
    if (row[3] && !isNaN(row[3])) {
      testimonialItems.push({
        quote: row[0],
        name: row[1],
        handle: row[2],
        rating: parseInt(row[3], 10),
      })
    } else if (row[1]) {
      testimonialMeta[row[0]] = row[1]
    }
  }
  const TESTIMONIALS = {
    sectionLabel: testimonialMeta['Section label'],
    heading: testimonialMeta['Section heading'],
    subtitle: testimonialMeta['Section subtitle'],
    items: testimonialItems,
  }

  // --- Contact ---
  const contactKV = parseKV(contactRows)
  const inquiryOptions = []
  let j = 1
  while (contactKV[`Inquiry option ${j}`]) {
    inquiryOptions.push(contactKV[`Inquiry option ${j}`])
    j++
  }
  const CONTACT = {
    sectionLabel: contactKV['Section label'],
    heading: contactKV['Heading'],
    subtitle: contactKV['Subtitle'],
    nameLabel: contactKV['Form field: Name label'],
    namePlaceholder: contactKV['Form field: Name placeholder'],
    emailLabel: contactKV['Form field: Email label'],
    emailPlaceholder: contactKV['Form field: Email placeholder'],
    inquiryLabel: contactKV['Form field: Inquiry label'],
    inquiryPlaceholder: contactKV['Form field: Inquiry placeholder'],
    inquiryOptions,
    messageLabel: contactKV['Form field: Message label'],
    messagePlaceholder: contactKV['Form field: Message placeholder'],
    submitButton: contactKV['Submit button'],
    loadingButton: contactKV['Loading button'],
    successMessage: contactKV['Success message'],
    errorMessage: contactKV['Error message'],
  }

  // --- Shows section labels ---
  const showsMetaKV = {}
  for (const row of showsMetaRows) {
    if (row[1]) showsMetaKV[row[0]] = row[1]
  }
  const SHOWS = {
    sectionLabel: showsMetaKV['Section label'],
    heading: showsMetaKV['Section heading'],
    pastHeading: showsMetaKV['Past heading'],
    noShowsMessage: showsMetaKV['No shows message'],
    ticketLinkLabel: showsMetaKV['Ticket link label'],
    pastLinkLabel: showsMetaKV['Past link label'],
  }

  // --- Footer ---
  const footerKV = {}
  for (const row of footerNavRows) {
    if (row[0] === 'Footer' && row[1]) footerKV[row[1]] = row[2] ?? ''
  }
  const FOOTER = {
    tagline: footerKV['Tagline'],
  }

  // --- Photos ---
  // Data rows: col A starts with '/' (a path or URL)
  // Metadata rows: col A is a plain label key, col B is the value
  const photoItems = []
  const photoMeta = {}
  for (const row of photosRows.slice(1)) {
    if (!row[0]) continue
    if (row[0].startsWith('/') || row[0].startsWith('http')) {
      photoItems.push({ src: row[0], alt: row[1] ?? '', group: row[2] ?? '' })
    } else if (row[1]) {
      photoMeta[row[0]] = row[1]
    }
  }
  const GALLERY = {
    sectionLabel: photoMeta['Section label'] ?? 'Photos',
    heading: photoMeta['Section heading'] ?? 'Live Photos',
  }

  // Write content.js
  const contentJs =
    `// Auto-generated — do not edit by hand.\n` +
    `// Run \`npm run sync-content\` to pull updates from Google Sheets.\n\n` +
    `export const HERO = ${JSON.stringify(HERO, null, 2)}\n\n` +
    `export const ABOUT = ${JSON.stringify(ABOUT, null, 2)}\n\n` +
    `export const TESTIMONIALS = ${JSON.stringify(TESTIMONIALS, null, 2)}\n\n` +
    `export const CONTACT = ${JSON.stringify(CONTACT, null, 2)}\n\n` +
    `export const FOOTER = ${JSON.stringify(FOOTER, null, 2)}\n\n` +
    `export const SHOWS = ${JSON.stringify(SHOWS, null, 2)}\n\n` +
    `export const GALLERY = ${JSON.stringify(GALLERY, null, 2)}\n`

  writeFileSync(resolve(__dirname, '../src/data/content.js'), contentJs)
  console.log('✓ src/data/content.js updated')

  // Write photos.js
  const photosJs =
    `// Auto-generated — do not edit by hand.\n` +
    `// Run \`npm run sync-content\` to pull updates from Google Sheets.\n\n` +
    `export const allPhotos = ${JSON.stringify(photoItems, null, 2)}\n`

  writeFileSync(resolve(__dirname, '../src/data/photos.js'), photosJs)
  console.log('✓ src/data/photos.js updated')

  // --- Shows data ---
  const EVENTS = showsDataRows.map(([date, venue, location, url, upcoming]) => ({
      date,
      venue,
      location,
      url,
      upcoming: upcoming === 'TRUE',
    }))

  const eventsJs =
    `// Auto-generated — do not edit by hand.\n` +
    `// Run \`npm run sync-content\` to pull updates from Google Sheets.\n` +
    `// Set "Upcoming?" to TRUE for future shows, FALSE for past shows.\n\n` +
    `export const EVENTS = ${JSON.stringify(EVENTS, null, 2)}\n`

  writeFileSync(resolve(__dirname, '../src/data/events.js'), eventsJs)
  console.log('✓ src/data/events.js updated')
}

function parseKV(rows) {
  const map = {}
  for (const row of rows.slice(1)) {
    const field = row[0]?.trim()
    if (field) map[field] = row[1] ?? ''
  }
  return map
}

async function readTab(sheets, range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  })
  return res.data.values || []
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
