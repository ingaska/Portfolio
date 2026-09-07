import { timingSafeEqual } from 'node:crypto'
import { ServiceError } from './errors'
import { pickBackend } from './backend'

/* Where the prototype keeps what the user makes: preferences and created
 * cards, so they survive a reload and follow her from the Mac to the phone.
 *
 * One owner, no accounts (CLAUDE.md § Not in v1): every request carries the
 * sync passphrase set in Settings, checked against LEXIS_OWNER_TOKEN on the
 * server. API keys are stored only as ciphertext the browser produced with
 * that passphrase (see the client's crypto.ts); the server never sees them
 * readable.
 *
 * The SQL lives in a backend (backend-supabase.ts on sumska.io,
 * backend-libsql.ts for a local file); this module owns the shapes, the
 * validation and the passphrase check. */

export const OWNER = 'inga'

export type Settings = Record<string, unknown>

export interface StoredCard {
  id: string
  folder: string
  greek: string
  article: string | null
  translation: string
  transliteration: string
  sentence: string
  grammarNote: string
  tag: string
  subject: string | null
  /** A data: URL, or null. */
  picture: string | null
  tile: string | null
  createdAt: number
  dueAt: number
  intervalDays: number
  ease: number
  repetitions: number
}

export type NewCard = Pick<StoredCard, 'id' | 'greek' | 'translation' | 'transliteration'> &
  Partial<Omit<StoredCard, 'id' | 'greek' | 'translation' | 'transliteration'>>

export interface Backend {
  getSettings(owner: string): Promise<Settings>
  putSettings(owner: string, patch: Settings, now: number): Promise<void>
  listCards(owner: string): Promise<StoredCard[]>
  /** Insert or replace by id. A card arriving without a picture keeps the stored one. */
  upsertCards(owner: string, cards: StoredCard[]): Promise<void>
  deleteCards(owner: string, ids: string[]): Promise<void>
}

let backend: Backend | null = null
const store = () => (backend ??= pickBackend())

export function configured(): boolean {
  return !!process.env.LEXIS_OWNER_TOKEN
}

/** Throws 503 when the server has no passphrase, 401 when the caller's does not match. */
export function authorize(token: string | null | undefined): void {
  const expected = process.env.LEXIS_OWNER_TOKEN
  if (!expected) throw new ServiceError(503, 'Sync is not set up on this server yet')
  const a = Buffer.from(token ?? '')
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new ServiceError(401, 'The sync passphrase does not match')
}

export const getSettings = (owner = OWNER) => store().getSettings(owner)

export async function putSettings(patch: Settings, owner = OWNER): Promise<Settings> {
  await store().putSettings(owner, patch, Date.now())
  return store().getSettings(owner)
}

export const listCards = (owner = OWNER) => store().listCards(owner)

/** Fill in defaults, validate, and hand the backend complete rows. */
export async function upsertCards(cards: NewCard[], owner = OWNER): Promise<number> {
  if (!cards.length) return 0
  const now = Date.now()
  const rows: StoredCard[] = cards.map(c => {
    if (!c.id || !c.greek?.trim() || !c.translation?.trim()) throw new ServiceError(400, 'each card needs an id, greek and translation')
    if (c.picture && c.picture.length > 2_000_000) throw new ServiceError(413, `the picture for ${c.greek} is too large to store`)
    return {
      id: c.id,
      folder: c.folder ?? 'recent',
      greek: c.greek,
      article: c.article ?? null,
      translation: c.translation,
      transliteration: c.transliteration ?? '',
      sentence: c.sentence ?? '',
      grammarNote: c.grammarNote ?? '',
      tag: c.tag ?? 'other',
      subject: c.subject ?? null,
      picture: c.picture ?? null,
      tile: c.tile ?? null,
      createdAt: c.createdAt ?? now,
      dueAt: c.dueAt ?? now,
      intervalDays: c.intervalDays ?? 1,
      ease: c.ease ?? 2.5,
      repetitions: c.repetitions ?? 0,
    }
  })
  await store().upsertCards(owner, rows)
  return rows.length
}

export async function deleteCards(ids: string[], owner = OWNER): Promise<number> {
  if (!ids.length) return 0
  await store().deleteCards(owner, ids)
  return ids.length
}

/** Everything the app needs on open, in one round trip. */
export async function getState(owner = OWNER): Promise<{ settings: Settings; cards: StoredCard[] }> {
  const [settings, cards] = await Promise.all([getSettings(owner), listCards(owner)])
  return { settings, cards }
}
