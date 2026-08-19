/**
 * Pre-render script — runs after vite build + ssr build.
 * Loads the SSR bundle, renders the React app to an HTML string,
 * and injects it into dist/index.html so crawlers get real content.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { EVENTS } from '../src/data/events.js'
import { SETLIST } from '../src/data/setlist.js'

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

// Inject the setlist as an ItemList of the Weezer material we perform.
// These are covers, so each song is credited to Weezer as byArtist — modelling
// them as our own `track`s would be wrong.
const setlistItems = SETLIST.albums.flatMap((a) =>
  a.songs.map((song) => ({
    '@type': 'MusicRecording',
    name: song,
    byArtist: { '@type': 'MusicGroup', name: 'Weezer' },
    inAlbum: { '@type': 'MusicAlbum', name: a.album, datePublished: a.year },
  }))
)

const setlistSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': 'https://wrestlewithjimmy.com/#setlist',
  name: 'Wrestle With Jimmy — Weezer Setlist',
  description:
    "The Weezer songs Wrestle With Jimmy performs live: the complete Blue Album, plus Pinkerton, Green Album, Make Believe and Red Album selections.",
  numberOfItems: setlistItems.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: setlistItems.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item,
  })),
}

html = html.replace(
  '<!-- Structured Data: Setlist (generated from src/data/setlist.js at prerender) -->',
  `<script type="application/ld+json">\n${JSON.stringify(setlistSchema, null, 2)}\n    </script>`
)
console.log(`Injected setlist schema for ${setlistItems.length} songs`)

/**
 * Central Time UTC offset for a given date — CDT (-05:00) during daylight saving,
 * CST (-06:00) otherwise. Hardcoding one or the other misstates the start time of
 * every show on the wrong side of the DST boundary.
 */
function centralOffset(dateStr) {
  const noonUTC = new Date(`${dateStr}T12:00:00Z`)
  const tzName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    timeZoneName: 'short',
  })
    .formatToParts(noonUTC)
    .find((p) => p.type === 'timeZoneName').value
  return tzName === 'CDT' ? '-05:00' : '-06:00'
}

/** "Austin, TX" -> a PostalAddress. Falls back to the raw string as locality. */
function toAddress(location) {
  const [locality, region] = location.split(',').map((s) => s.trim())
  return {
    '@type': 'PostalAddress',
    addressLocality: locality,
    ...(region ? { addressRegion: region } : {}),
    addressCountry: 'US',
  }
}

// Inject MusicEvent JSON-LD for upcoming shows
const upcoming = EVENTS.filter((e) => e.upcoming).sort((a, b) => a.date.localeCompare(b.date))
if (upcoming.length > 0) {
  const schemas = upcoming.map((e) => ({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `Wrestle With Jimmy at ${e.venue}`,
    startDate: `${e.date}T20:00:00${centralOffset(e.date)}`,
    endDate: `${e.date}T23:00:00${centralOffset(e.date)}`,
    description: `Wrestle With Jimmy — Austin's premier Weezer cover band — performing live at ${e.venue} in ${e.location}. Expect Blue Album classics and '90s/2000s alt rock.`,
    image: 'https://wrestlewithjimmy.com/photos/barton-springs/hero-1.webp',
    performer: { '@id': 'https://wrestlewithjimmy.com/#musicgroup' },
    url: 'https://wrestlewithjimmy.com/#events',
    location: {
      '@type': 'MusicVenue',
      name: e.venue,
      address: toAddress(e.location),
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
