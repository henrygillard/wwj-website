/**
 * Pre-render script — runs after vite build + ssr build.
 * Loads the SSR bundle, renders the React app to an HTML string,
 * and injects it into dist/index.html so crawlers get real content.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { EVENTS } from '../src/data/events.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

const bundlePath = path.join(distDir, 'entry-server.js')
if (!fs.existsSync(bundlePath)) {
  console.error('SSR bundle not found at', bundlePath)
  console.error('Run `vite build --config vite.config.ssr.js` first.')
  process.exit(1)
}

const { render } = await import(bundlePath)
const appHtml = render()

const htmlPath = path.join(distDir, 'index.html')
let html = fs.readFileSync(htmlPath, 'utf-8')
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

// Inject MusicEvent JSON-LD for upcoming shows
const upcoming = EVENTS.filter((e) => e.upcoming).sort((a, b) => a.date.localeCompare(b.date))
if (upcoming.length > 0) {
  const schemas = upcoming.map((e) => ({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `Wrestle With Jimmy at ${e.venue}`,
    startDate: `${e.date}T20:00:00-05:00`,
    endDate: `${e.date}T23:00:00-05:00`,
    description: `Wrestle With Jimmy — Austin's premier Weezer cover band — performing live at ${e.venue} in ${e.location}. Expect Blue Album classics and '90s/2000s alt rock.`,
    image: 'https://wrestlewithjimmy.com/photos/barton-springs/hero-1.webp',
    performer: { '@id': 'https://wrestlewithjimmy.com/#musicgroup' },
    location: {
      '@type': 'MusicVenue',
      name: e.venue,
      address: e.location,
    },
    organizer: { '@id': 'https://wrestlewithjimmy.com/#musicgroup' },
    offers: {
      '@type': 'Offer',
      url: e.url,
      validFrom: e.date,
      availability: 'https://schema.org/InStock',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  }))

  const tag = `<script type="application/ld+json">\n${JSON.stringify(
    schemas.length === 1 ? schemas[0] : schemas,
    null,
    2
  )}\n    </script>`

  html = html.replace(
    '<!-- Structured Data: Upcoming Events (populated when shows are scheduled) -->',
    tag
  )
  console.log(`Injected event schema for ${upcoming.length} upcoming show(s)`)
} else {
  console.log('No upcoming shows — event schema placeholder left empty')
}

fs.writeFileSync(htmlPath, html)
console.log('Pre-render complete — content injected into dist/index.html')
