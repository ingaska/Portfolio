import { NextResponse } from 'next/server'
import { putSettings } from '@/lib/flipsi/store'
import { guard } from '@/lib/flipsi/sync-route'
import { fail } from '@/lib/flipsi/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* PUT /api/flipsi/sync/settings — merge a patch of preferences. */
export async function PUT(request: Request) {
  const denied = guard(request)
  if (denied) return denied
  try {
    return NextResponse.json({ settings: await putSettings(await request.json()) })
  } catch (err) {
    return fail(err)
  }
}
