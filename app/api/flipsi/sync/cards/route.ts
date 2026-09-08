import { NextResponse } from 'next/server'
import { deleteAllCards, deleteCards, upsertCards, type NewCard } from '@/lib/flipsi/store'
import { guard } from '@/lib/flipsi/sync-route'
import { fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

/* POST /api/flipsi/sync/cards — insert or replace { cards: [...] }. */
export async function POST(request: Request) {
  const denied = guard(request)
  if (denied) return denied
  try {
    const { cards = [] } = (await request.json()) as { cards?: NewCard[] }
    return NextResponse.json({ stored: await upsertCards(cards) })
  } catch (err) {
    return fail(err)
  }
}

/* DELETE /api/flipsi/sync/cards — { ids: [...] }. */
export async function DELETE(request: Request) {
  const denied = guard(request)
  if (denied) return denied
  try {
    const { ids = [], all = false } = (await request.json()) as { ids?: string[]; all?: boolean }
    if (all === true) { await deleteAllCards(); return NextResponse.json({ deleted: 'all' }) }
    return NextResponse.json({ deleted: await deleteCards(ids) })
  } catch (err) {
    return fail(err)
  }
}
