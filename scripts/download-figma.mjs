/**
 * Prebuild script: downloads all Figma frames as PNGs to /public/figma-cache/
 * Never crashes the build — all failures are warnings, not errors.
 */
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'figma-cache')

// Load .env.local in dev (Vercel sets env vars natively at build time)
const envFile = join(ROOT, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf-8').split('\n')) {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const key = line.slice(0, eq).trim()
      const val = line.slice(eq + 1).trim()
      if (key && !process.env[key]) process.env[key] = val
    }
  }
}

const FILE_ID = process.env.FIGMA_FILE_ID
const TOKEN = process.env.FIGMA_API_TOKEN

if (!FILE_ID || !TOKEN) {
  console.warn('[figma] Missing env vars — skipping image download')
  process.exit(0)
}

mkdirSync(OUT, { recursive: true })

// Extract Figma node IDs from cases.ts
const src = readFileSync(join(ROOT, 'data', 'cases.ts'), 'utf-8')
const nodeIds = [...new Set([...src.matchAll(/'(\d+:\d+)'/g)].map(m => m[1]))]
console.log(`[figma] ${nodeIds.length} node IDs found`)

// Fetch Figma image URLs — batch of 4 with retry, never throws
const BATCH = 4
const allImages = {}

for (let i = 0; i < nodeIds.length; i += BATCH) {
  const batch = nodeIds.slice(i, i + BATCH)
  const ids = batch.join(',')
  const url = `https://api.figma.com/v1/images/${FILE_ID}?ids=${encodeURIComponent(ids)}&format=png&scale=2`

  let success = false
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } })
      if (res.ok) {
        const { images } = await res.json()
        Object.assign(allImages, images)
        success = true
        break
      }
      console.warn(`[figma] Batch ${Math.floor(i/BATCH)+1} attempt ${attempt}: HTTP ${res.status}`)
    } catch (e) {
      console.warn(`[figma] Batch ${Math.floor(i/BATCH)+1} attempt ${attempt}: ${e.message}`)
    }
    await new Promise(r => setTimeout(r, 2000 * attempt))
  }

  if (!success) console.warn(`[figma] Batch ${Math.floor(i/BATCH)+1} failed — images will be missing`)
  console.log(`[figma] Batch ${Math.floor(i/BATCH)+1}/${Math.ceil(nodeIds.length/BATCH)} done`)
  if (i + BATCH < nodeIds.length) await new Promise(r => setTimeout(r, 500))
}

// Download images
const entries = Object.entries(allImages).filter(([, url]) => !!url)
console.log(`[figma] Downloading ${entries.length} images...`)

const results = await Promise.allSettled(
  entries.map(async ([id, url]) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await writeFile(join(OUT, `${id.replace(/:/g, '-')}.png`), buf)
    console.log(`[figma] Saved ${id}`)
  })
)

const ok = results.filter(r => r.status === 'fulfilled').length
const fail = results.filter(r => r.status === 'rejected').length
console.log(`[figma] Done: ${ok} saved, ${fail} failed`)
// Always exit 0 — never crash the build
process.exit(0)
