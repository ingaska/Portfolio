/**
 * All Figma images are downloaded at build time to /public/figma-cache/.
 * At runtime we just return the static local paths — no Figma API calls,
 * no expiring CDN URLs.
 */

function cachedPath(nodeId: string): string {
  return `/figma-cache/${nodeId.replace(/:/g, '-')}.png`
}

export async function getFigmaImageUrls(nodeIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  for (const id of nodeIds) result[id] = cachedPath(id)
  return result
}

export async function getCaseDetailImages(nodeIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  for (const id of nodeIds) {
    if (id.startsWith('local:')) result[id] = '/' + id.slice('local:'.length)
    else result[id] = cachedPath(id)
  }
  return result
}
