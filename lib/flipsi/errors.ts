/* One error shape for every service, so a route (Express here, a Vercel
 * function on sumska.io) can turn it into a status without knowing which
 * provider failed. */
export class ServiceError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
    this.name = 'ServiceError'
  }
}

/** Google's error body, reduced to a sentence. */
export async function googleDetail(r: Response): Promise<string> {
  try {
    const body = (await r.json()) as { error?: { message?: string } }
    return body.error?.message ?? r.statusText
  } catch {
    return r.statusText
  }
}

export function googleError(r: Response, detail: string, service: string): ServiceError {
  if (r.status === 400 || r.status === 403) {
    return new ServiceError(401, `Google rejected the key or the request: ${detail}`)
  }
  return new ServiceError(502, `${service} error ${r.status}: ${detail}`)
}
