/**
 * Prebuild script: downloads all Figma frames as PNGs to /public/figma-cache/
 * Run automatically via `npm run build` (prebuild hook).
 */
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public', 'figma-cache')

// Load .env.local if env vars not already set (local dev support)
const envFile = join(ROOT, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf-8').split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
}

const FILE_ID = process.env.FIGMA_FILE_ID
const TOKEN = process.env.FIGMA_API_TOKEN

if (!FILE_ID || !TOKEN) {
  console.warn('[figma] FIGMA_FILE_ID or FIGMA_API_TOKEN not set — skipping image download')
  process.exit(0)
}

// Extract all Figma node IDs from cases.ts (pattern: 'digits:digits')
const src = readFileSync(join(ROOT, 'data', 'cases.ts'), 'utf-8')
const nodeIds = [...new Set([...src.matchAll(/'(\d+:\d+)'/g)].map(m => m[1]))]

console.log(`[figma] Found ${nodeIds.length} unique node IDs`)
mkdirSync(OUT, { recursive: true })

// Fetch image URLs from Figma API in batches of 8
const BATCH = 8
const allImages = {}
for (let i = 0; i < nodeIds.length; i += BATCH) {
  const batch = nodeIds.slice(i, i + BATCH)
  const ids = batch.join(',')
  const apiUrl = `https://api.figma.com/v1/images/${FILE_ID}?ids=${encodeURIComponent(ids)}&format=png&scale=1`
  const apiRes = await fetch(apiUrl, { headers: { 'X-Figma-Token': TOKEN } })
  if (!apiRes.ok) {
    console.error(`[figma] API error on batch ${i / BATCH + 1}:`, apiRes.status, await apiRes.text())
    process.exit(1)
  }
  const { images } = await apiRes.json()
  Object.assign(allImages, images)
  console.log(`[figma] Batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(nodeIds.length / BATCH)} fetched`)
}

const entries = Object.entries(allImages).filter(([, url]) => !!url)
console.log(`[figma] Downloading ${entries.length} images...`)

// Download all images in parallel
const results = await Promise.allSettled(
  entries.map(async ([id, url]) => {
    const imgRes = await fetch(url)
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status} for ${id}`)
    const buf = Buffer.from(await imgRes.arrayBuffer())
    const filename = `${id.replace(/:/g, '-')}.png`
    await writeFile(join(OUT, filename), buf)
    return filename
  })
)

const ok = results.filter(r => r.status === 'fulfilled').length
const fail = results.filter(r => r.status === 'rejected').length
console.log(`[figma] Done: ${ok} downloaded, ${fail} failed`)
if (fail > 0) {
  results.filter(r => r.status === 'rejected').forEach(r => console.error(' ✗', r.reason))
}
