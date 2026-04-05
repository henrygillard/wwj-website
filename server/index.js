import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Serve the built React app
app.use(express.static(join(__dirname, '../dist')))

// SPA fallback — serve index.html for any route
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`WWJ server running at http://localhost:${PORT}`)
})
