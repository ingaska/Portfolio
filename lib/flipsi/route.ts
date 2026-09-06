import { NextResponse } from 'next/server'
import { diskCache } from './cache'
import { ServiceError } from './errors'

/* Shared bits for the three /api/flipsi routes, the live backend of the
 * Λέξις prototype at /flipsi. The core under lib/flipsi/ is copied verbatim
 * from the flash-cards repo (server/core/) by its deploy script; only this
 * file and the route handlers are written for Next. */

/** /tmp lives as long as the function instance: a best-effort cache. */
export const cache = diskCache('/tmp/flipsi-cache')

export function fail(err: unknown): NextResponse {
  if (err instanceof ServiceError) return NextResponse.json({ error: err.message }, { status: err.status })
  console.error('flipsi:', err)
  return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
}
