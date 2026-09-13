import { NextResponse } from 'next/server'
import { rethinkSubject } from '@/lib/flipsi/cards'
import { fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
export const maxDuration = 30

/* POST /api/flipsi/subject — a different picture idea for one card, before a redraw. */
export async function POST(request: Request) {
  try {
    return NextResponse.json(await rethinkSubject(await request.json()))
  } catch (err) {
    return fail(err)
  }
}
