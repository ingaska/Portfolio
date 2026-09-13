import { NextResponse } from 'next/server'
import { rewriteSentence } from '@/lib/flipsi/cards'
import { fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
export const maxDuration = 30

/* POST /api/flipsi/sentence — a fresh example sentence for one card, with the user's key. */
export async function POST(request: Request) {
  try {
    return NextResponse.json(await rewriteSentence(await request.json()))
  } catch (err) {
    return fail(err)
  }
}
