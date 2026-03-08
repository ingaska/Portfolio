/**
 * In production, images are downloaded at build time to /public/figma-cache/
 * by scripts/download-figma.mjs and served as static files.
 * In development, falls back to live Figma API.
 */

const FILE_ID = process.env.FIGMA_FILE_ID!
const TOKEN = process.env.FIGMA_API_TOKEN!

const IS_PROD = process.env.NODE_ENV === 'production'

function nodeToLocalPath(id: string): string {
  return `/figma-cache/${id.replace(/:/g, '-')}.png`
}

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

export async function getFigmaImageUrls(nodeIds: string[]): Promise<Record<string, string>> {
  if (!nodeIds.length) return {}
  if (IS_PROD) return Object.fromEntries(nodeIds.map(id => [id, nodeToLocalPath(id)]))
  return fetchFromFigma(nodeIds)
}

export async function getCaseDetailImages(nodeIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  for (const id of nodeIds) {
    if (id.startsWith('local:')) {
      result[id] = '/' + id.slice('local:'.length)
    } else if (IS_PROD) {
      result[id] = nodeToLocalPath(id)
    }
  }
  const missingFigmaIds = nodeIds.filter(id => !id.startsWith('local:') && !IS_PROD)
  if (missingFigmaIds.length > 0) {
    Object.assign(result, await fetchFromFigma(missingFigmaIds))
  }
  return result
}
