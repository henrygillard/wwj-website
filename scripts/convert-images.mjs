/**
 * convert-images.mjs — Batch JPEG-to-WebP conversion for all photos.
 * Converts all 35 JPEG files in public/photos/ to compressed WebP format,
 * then updates src/data/photos.js with .webp paths and intrinsic width/height
 * per entry.
 *
 * Resize targets:
 *   barton-springs/hero-1.jpg  → 600×900 max bounding box, q60 (portrait — must stay under 100 KB)
 *   barton-springs/hero-2.jpg  → maxWidth: 1200, q50 (portrait — must stay under 120 KB)
 *   radio-east/cover-image.jpg → maxWidth: 1200, q75
 *   All gallery DSC*.jpg       → maxWidth: 800, q75
 *
 * Note: hero-1 and hero-2 are portrait images (4:6 ratio). Constraining by width
 * alone (1920px, 1200px) produces files of 765 KB and 152 KB respectively at q75,
 * far exceeding their thresholds. A bounding-box + lower quality approach is used
 * to meet the PERF-01/PERF-02 size constraints.
 *
 * Run: node scripts/convert-images.mjs
 */
import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import { writeFileSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const photosDir = path.resolve(__dirname, '../public/photos')
const photosJsPath = path.resolve(__dirname, '../src/data/photos.js')

/**
 * Convert a JPEG file to WebP with the given bounding box and quality.
 * @param {string} inputPath   Absolute path to source JPEG
 * @param {number|null} maxW   Maximum width in pixels (null = unconstrained)
 * @param {number|null} maxH   Maximum height in pixels (null = unconstrained)
 * @param {number} quality     WebP quality (default 75)
 * @returns {{ outputPath: string, width: number, height: number, size: number }}
 */
async function convertToWebP(inputPath, maxW, maxH, quality = 75) {
  const dir = path.dirname(inputPath)
  const base = path.basename(inputPath, path.extname(inputPath))
  const outputPath = path.join(dir, `${base}.webp`)

  const info = await sharp(inputPath)
    .resize(maxW, maxH, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath)

  return { outputPath, width: info.width, height: info.height, size: info.size }
}

/**
 * Return resize params for a given basename.
 * Portrait hero images need a height cap + lower quality to stay within byte limits.
 * @returns {{ maxW: number|null, maxH: number|null, quality: number }}
 */
function getConversionParams(basename) {
  if (basename === 'hero-1') {
    // Portrait 4184×6276 — bounding box 600×900 at q60 → ~95 KB (under 100 KB limit)
    return { maxW: 600, maxH: 900, quality: 60 }
  }
  if (basename === 'hero-2') {
    // Portrait 4415×6623 — maxWidth 1200 at q50 → ~109 KB (under 120 KB limit)
    return { maxW: 1200, maxH: null, quality: 50 }
  }
  if (basename === 'cover-image') {
    return { maxW: 1200, maxH: null, quality: 75 }
  }
  return { maxW: 800, maxH: null, quality: 75 }
}

async function main() {
  const categories = ['barton-springs', 'radio-east']

  // Map from bare basename (e.g. "DSC06956") → { width, height }
  // Used to patch photos.js entries after conversion
  const dimensionMap = {}

  let totalConverted = 0

  for (const category of categories) {
    const dir = path.join(photosDir, category)
    const entries = await readdir(dir)
    const jpgFiles = entries.filter(f => f.toLowerCase().endsWith('.jpg')).sort()

    for (const filename of jpgFiles) {
      const inputPath = path.join(dir, filename)
      const basename = path.basename(filename, '.jpg')
      const { maxW, maxH, quality } = getConversionParams(basename)

      const result = await convertToWebP(inputPath, maxW, maxH, quality)
      dimensionMap[basename] = { width: result.width, height: result.height }

      const kb = (result.size / 1024).toFixed(1)
      console.log(`✓ converted ${category}/${basename}.webp (${kb} KB)`)
      totalConverted++
    }
  }

  console.log(`\n✓ Converted ${totalConverted} files`)

  // Update photos.js: replace .jpg → .webp in src, add width + height fields
  // Read the current module as text and eval the array via a simple approach
  const photosJsText = readFileSync(photosJsPath, 'utf-8')

  // Extract the JSON array from the JS module text
  // The file format is: export const allPhotos = [...]
  const arrayMatch = photosJsText.match(/export const allPhotos = (\[[\s\S]*\])\s*$/)
  if (!arrayMatch) {
    throw new Error('Could not parse allPhotos array from photos.js')
  }
  const currentPhotos = JSON.parse(arrayMatch[1])

  const updatedPhotos = currentPhotos.map(entry => {
    const srcWebp = entry.src.replace(/\.(jpg|webp)$/i, '.webp')
    // Extract the basename without extension (.jpg or .webp) to look up dimensions
    const basename = path.basename(entry.src).replace(/\.(jpg|webp)$/i, '')
    const dims = dimensionMap[basename]
    if (!dims) {
      throw new Error(`No conversion result found for basename: ${basename} (src: ${entry.src})`)
    }
    return {
      src: srcWebp,
      alt: entry.alt,
      group: entry.group,
      width: dims.width,
      height: dims.height,
    }
  })

  const photosJs =
    `// Auto-generated — do not edit by hand.\n` +
    `// Run \`npm run sync-content\` to pull updates from Google Sheets.\n\n` +
    `export const allPhotos = ${JSON.stringify(updatedPhotos, null, 2)}\n`

  writeFileSync(photosJsPath, photosJs)
  console.log('✓ src/data/photos.js updated')
}

main().catch((err) => { console.error(err); process.exit(1) })
