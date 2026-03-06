const FILE_ID = process.env.FIGMA_FILE_ID!
const TOKEN = process.env.FIGMA_API_TOKEN!

const BATCH_SIZE = 4

async function fetchBatch(nodeIds: string[]): Promise<Record<string, string>> {
  const ids = nodeIds.join(',')
  const url = `https://api.figma.com/v1/images/${FILE_ID}?ids=${encodeURIComponent(ids)}&format=png&scale=1`

  const res = await fetch(url, {
    headers: { 'X-Figma-Token': TOKEN },
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    console.error('Figma API error:', res.status, await res.text())
    return {}
  }

  const data = await res.json()
  return data.images ?? {}
}

export async function getFigmaImageUrls(nodeIds: string[]): Promise<Record<string, string>> {
  if (!TOKEN || !FILE_ID || !nodeIds.length) return {}
  const result: Record<string, string> = {}
  for (let i = 0; i < nodeIds.length; i += BATCH_SIZE) {
    const images = await fetchBatch(nodeIds.slice(i, i + BATCH_SIZE))
    Object.assign(result, images)
  }
  return result
}

// Handles both Figma node IDs and local asset paths (prefixed with "local:")
// e.g. "local:case-images/femia-retention.png" → "/case-images/femia-retention.png"
export async function getCaseDetailImages(nodeIds: string[]): Promise<Record<string, string>> {
  const localIds = nodeIds.filter((id) => id.startsWith('local:'))
  const figmaIds = nodeIds.filter((id) => !id.startsWith('local:'))

  const result: Record<string, string> = {}

  // Resolve local assets immediately (served from /public)
  for (const id of localIds) {
    result[id] = '/' + id.slice('local:'.length)
  }

  // Fetch Figma assets
  if (figmaIds.length > 0) {
    const figmaResult = await getFigmaImageUrls(figmaIds)
    Object.assign(result, figmaResult)
  }

  return result
}
