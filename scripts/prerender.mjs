/**
 * Pre-render script — runs after vite build + ssr build.
 * Loads the SSR bundle, renders the React app to an HTML string,
 * and injects it into dist/index.html so crawlers get real content.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
fs.writeFileSync(htmlPath, html)

console.log('Pre-render complete — content injected into dist/index.html')
