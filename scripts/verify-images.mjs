/**
 * verify-images.mjs — Image size and existence verification.
 * Checks all 35 WebP files in public/photos/ against their size thresholds.
 * Exits 0 if all files exist and are within targets; exits 1 with a failure
 * list otherwise.
 *
 * Thresholds:
 *   barton-springs/hero-1.webp  → 102400 bytes (100 KB)
 *   All other 34 WebP files     → 122880 bytes (120 KB)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const HERO_THRESHOLD = 102400   // 100 KB
const GALLERY_THRESHOLD = 122880 // 120 KB

const FILES = [
  // barton-springs — hero (100 KB threshold)
  { rel: 'barton-springs/hero-1.webp', threshold: HERO_THRESHOLD },
  // barton-springs — all other WebP files (120 KB threshold)
  { rel: 'barton-springs/hero-2.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC06956.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC06973.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC06978.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC06987.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC06995.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07023.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07049.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07069.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07123.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07136.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07157.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07164.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07182.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07334.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07401.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07425.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07459.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'barton-springs/DSC07479.webp', threshold: GALLERY_THRESHOLD },
  // radio-east
  { rel: 'radio-east/cover-image.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5611.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5612.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5618.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5623.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5628.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5633.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5634.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5635.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5645.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5648.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5650.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5656.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5666.webp', threshold: GALLERY_THRESHOLD },
  { rel: 'radio-east/DSC5682.webp', threshold: GALLERY_THRESHOLD },
]

async function main() {
  const photosDir = path.resolve(__dirname, '../public/photos')
  const failures = []

  for (const { rel, threshold } of FILES) {
    const filePath = path.resolve(photosDir, rel)
    if (!fs.existsSync(filePath)) {
      failures.push(`MISSING  ${rel}`)
      continue
    }
    const size = fs.statSync(filePath).size
    if (size > threshold) {
      const kb = (size / 1024).toFixed(1)
      const limitKb = (threshold / 1024).toFixed(0)
      failures.push(`TOO LARGE ${rel} — ${kb} KB (limit: ${limitKb} KB)`)
    }
  }

  if (failures.length > 0) {
    console.error(`✗ ${failures.length} verification failure(s):`)
    for (const msg of failures) {
      console.error(`  ${msg}`)
    }
    process.exit(1)
  }

  console.log('✓ All 35 WebP images verified — sizes within targets')
  process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
