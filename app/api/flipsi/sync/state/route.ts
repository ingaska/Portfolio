import { NextResponse } from 'next/server'
import { configured, getState } from '@/lib/flipsi/store'
import { guard } from '@/lib/flipsi/sync-route'
import { fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* GET /api/flipsi/sync/state — preferences and created cards, in one trip. */
export async function GET(request: Request) {
  const denied = guard(request)
  if (denied) return denied
  try {
    return NextResponse.json({ configured: configured(), ...(await getState()) })
  } catch (err) {
    return fail(err)
  }
}
