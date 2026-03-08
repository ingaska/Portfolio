/**
 * At build time, all Figma images are downloaded to /public/figma-cache/ by
 * scripts/download-figma.mjs. At runtime we simply return the static paths —
 * no Figma API calls, no expiring URLs, no caching issues.
 *
 * Falls back to live Figma API in development if the cache folder is missing.
 */
import { existsSync } from 'fs'
import { join } from 'path'

const FILE_ID = process.env.FIGMA_FILE_ID!
const TOKEN = process.env.FIGMA_API_TOKEN!

function nodeToLocalPath(id: string): string {
  return `/figma-cache/${id.replace(/:/g, '-')}.png`
}

function cacheExists(): boolean {
  try {
    return existsSync(join(process.cwd(), 'public', 'figma-cache'))
  } catch {
    return false
  }
}

// --- Live API fallback (dev only) ---

async function fetchFromFigma(nodeIds: string[]): Promise<Record<string, string>> {
  if (!TOKEN || !FILE_ID || !nodeIds.length) return {}
  const ids = nodeIds.join(',')
  const url = `https://api.figma.com/v1/images/${FILE_ID}?ids=${encodeURIComponent(ids)}&format=png&scale=1`
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } })
  if (!res.ok) {
    console.error('Figma API error:', res.status, await res.text())
    return {}
  }
  const data = await res.json()
  return data.images ?? {}
}

// --- Public API ---

export async function getFigmaImageUrls(nodeIds: string[]): Promise<Record<string, string>> {
  if (!nodeIds.length) return {}

  if (cacheExists()) {
    // Production: return local static paths
    return Object.fromEntries(nodeIds.map(id => [id, nodeToLocalPath(id)]))
  }

  // Dev fallback: fetch live from Figma API
  return fetchFromFigma(nodeIds)
}

export async function getCaseDetailImages(nodeIds: string[]): Promise<Record<string, string>> {
  const localIds = nodeIds.filter(id => id.startsWith('local:'))
  const figmaIds = nodeIds.filter(id => !id.startsWith('local:'))

  const result: Record<string, string> = {}

  for (const id of localIds) {
    result[id] = '/' + id.slice('local:'.length)
  }

  if (figmaIds.length > 0) {
    if (cacheExists()) {
      for (const id of figmaIds) {
        result[id] = nodeToLocalPath(id)
      }
    } else {
      Object.assign(result, await fetchFromFigma(figmaIds))
    }
  }

  return result
}
