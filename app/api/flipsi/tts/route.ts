import { synthesize } from '@/lib/flipsi/tts'
import { cache, fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
export const maxDuration = 30

/* POST /api/flipsi/tts — Google Text-to-Speech reads a word aloud. */
export async function POST(request: Request) {
  try {
    const { mp3, cached } = await synthesize(await request.json(), cache)
    return new Response(new Uint8Array(mp3), {
      headers: { 'Content-Type': 'audio/mpeg', 'X-Lexis-Cache': cached ? 'hit' : 'miss' },
    })
  } catch (err) {
    return fail(err)
  }
}
