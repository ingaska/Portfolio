const FILE_ID = process.env.FIGMA_FILE_ID!
const TOKEN = process.env.FIGMA_API_TOKEN!

async function fetchBatch(nodeIds: string[]): Promise<Record<string, string>> {
  const ids = nodeIds.join(',')
  const url = `https://api.figma.com/v1/images/${FILE_ID}?ids=${encodeURIComponent(ids)}&format=png&scale=1`
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': TOKEN },
    next: { revalidate: 3600 },
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
  const BATCH = 20
  const batches: string[][] = []
  for (let i = 0; i < nodeIds.length; i += BATCH) batches.push(nodeIds.slice(i, i + BATCH))
  const results = await Promise.all(batches.map(fetchBatch))
  return Object.assign({}, ...results)
}

export async function getCaseDetailImages(nodeIds: string[]): Promise<Record<string, string>> {
  const localIds = nodeIds.filter(id => id.startsWith('local:'))
  const figmaIds = nodeIds.filter(id => !id.startsWith('local:'))
  const result: Record<string, string> = {}
  for (const id of localIds) result[id] = '/' + id.slice('local:'.length)
  if (figmaIds.length > 0) Object.assign(result, await getFigmaImageUrls(figmaIds))
  return result
}
