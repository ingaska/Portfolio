import { NextResponse } from 'next/server'
import { writeCards } from '@/lib/flipsi/cards'
import { fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
export const maxDuration = 60

/* POST /api/flipsi/generate — Claude Haiku 4.5 writes the cards with the
 * user's own key, which is forwarded to Anthropic and never stored. */
export async function POST(request: Request) {
  try {
    return NextResponse.json(await writeCards(await request.json()))
  } catch (err) {
    return fail(err)
  }
}
