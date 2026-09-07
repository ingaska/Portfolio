import { NextResponse } from 'next/server'
import { ServiceError } from './errors'
import { authorize } from './store'
import { fail } from './route'

/* Shared guard for the /api/flipsi/sync routes: the sync passphrase must
 * match LEXIS_OWNER_TOKEN (set in the Vercel project). Unlike local dev, a
 * server without the variable refuses with 503 rather than accepting anyone. */
export function guard(request: Request): NextResponse | null {
  try {
    authorize(request.headers.get('x-lexis-token'))
    return null
  } catch (err) {
    return err instanceof ServiceError ? NextResponse.json({ error: err.message }, { status: err.status }) : fail(err)
  }
}
