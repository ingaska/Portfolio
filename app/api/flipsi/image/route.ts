import { NextResponse } from 'next/server'
import { illustrate, REFERENCE_FILES, toDataUrl, type ReferencePart } from '@/lib/flipsi/illustrate'
import { cache, fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
// A picture can take 20s, and a cropped first render is drawn once more.
export const maxDuration = 60

/* The reference illustrations are served as static files at /flipsi/style/,
 * so the function fetches them from its own deployment rather than relying
 * on the bundler to trace file reads. */
let references: Promise<ReferencePart[]> | null = null
const loadReferences = (origin: string) =>
  (references ??= Promise.all(
    REFERENCE_FILES.map(async f => {
      const r = await fetch(new URL(`/flipsi/style/${f}`, origin))
      if (!r.ok) throw new Error(`reference ${f} missing (${r.status})`)
      return { inlineData: { mimeType: 'image/png', data: Buffer.from(await r.arrayBuffer()).toString('base64') } }
    }),
  ))

/* POST /api/flipsi/image — Gemini draws a card illustration. */
export async function POST(request: Request) {
  try {
    const origin = new URL(request.url).origin
    const { bytes, mimeType, tile, cached } = await illustrate(await request.json(), cache, () => loadReferences(origin))
    return NextResponse.json({ dataUrl: toDataUrl(bytes, mimeType), tile, cached })
  } catch (err) {
    return fail(err)
  }
}
