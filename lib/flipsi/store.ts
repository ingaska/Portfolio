import { createClient, type Client, type InArgs } from '@libsql/client'
import { timingSafeEqual } from 'node:crypto'
import { ServiceError } from './errors'

/* Where the prototype keeps what the user makes: preferences and created
 * cards, so they survive a reload and follow her from the Mac to the phone.
 *
 * libSQL is SQLite: locally it is a file next to lexis.db, on sumska.io it is
 * a Turso database, and the SQL is the same. One owner, no accounts (CLAUDE.md
 * § Not in v1): every request carries the sync passphrase set in Settings,
 * checked against LEXIS_OWNER_TOKEN on the server. API keys are stored only
 * as ciphertext the browser produced with that passphrase (see the client's
 * crypto.ts); the server never sees them readable.
 *
 * Configuration (environment):
 *   LEXIS_DB_URL        libsql://... (Turso) or file:./lexis-sync.db (default)
 *   LEXIS_DB_TOKEN      Turso auth token (not needed for a file)
 *   LEXIS_OWNER_TOKEN   the sync passphrase; unset = sync is not configured */

export const OWNER = 'inga'

let client: Client | null = null
let ready: Promise<void> | null = null

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

function db(): Client {
  if (!client) {
    client = createClient({
      url: process.env.LEXIS_DB_URL ?? 'file:./lexis-sync.db',
      authToken: process.env.LEXIS_DB_TOKEN,
    })
  }
  return client
}

async function init(): Promise<void> {
  ready ??= (async () => {
    await db().batch(
      [
        `CREATE TABLE IF NOT EXISTS settings (
           owner      TEXT NOT NULL,
           key        TEXT NOT NULL,
           value      TEXT NOT NULL,
           updated_at INTEGER NOT NULL,
           PRIMARY KEY (owner, key)
         )`,
        `CREATE TABLE IF NOT EXISTS cards (
           id               TEXT PRIMARY KEY,
           owner            TEXT NOT NULL,
           folder           TEXT NOT NULL DEFAULT 'recent',
           greek            TEXT NOT NULL,
           article          TEXT,
           translation      TEXT NOT NULL,
           transliteration  TEXT NOT NULL,
           sentence         TEXT NOT NULL DEFAULT '',
           grammar_note     TEXT NOT NULL DEFAULT '',
           tag              TEXT NOT NULL DEFAULT 'other',
           subject          TEXT,
           picture          TEXT,
           tile             TEXT,
           created_at       INTEGER NOT NULL,
           due_at           INTEGER NOT NULL,
           interval_days    INTEGER NOT NULL DEFAULT 1,
           ease             REAL NOT NULL DEFAULT 2.5,
           repetitions      INTEGER NOT NULL DEFAULT 0
         )`,
        `CREATE INDEX IF NOT EXISTS idx_cards_owner ON cards(owner, created_at)`,
      ],
      'write',
    )
  })()
  await ready
}

/* ---- Settings: a small JSON document per key --------------------------- */

export type Settings = Record<string, unknown>

export async function getSettings(owner = OWNER): Promise<Settings> {
  await init()
  const r = await db().execute({ sql: 'SELECT key, value FROM settings WHERE owner = ?', args: [owner] })
  const out: Settings = {}
  for (const row of r.rows) out[String(row.key)] = JSON.parse(String(row.value))
  return out
}

export async function putSettings(patch: Settings, owner = OWNER): Promise<Settings> {
  await init()
  const now = Date.now()
  const stmts = Object.entries(patch).map(([key, value]) => ({
    sql: `INSERT INTO settings (owner, key, value, updated_at) VALUES (?, ?, ?, ?)
          ON CONFLICT(owner, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    args: [owner, key, JSON.stringify(value ?? null), now] as InArgs,
  }))
  if (stmts.length) await db().batch(stmts, 'write')
  return getSettings(owner)
}

/* ---- Cards ------------------------------------------------------------- */

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

function rowToCard(row: Record<string, unknown>): StoredCard {
  return {
    id: String(row.id),
    folder: String(row.folder),
    greek: String(row.greek),
    article: row.article == null ? null : String(row.article),
    translation: String(row.translation),
    transliteration: String(row.transliteration),
    sentence: String(row.sentence ?? ''),
    grammarNote: String(row.grammar_note ?? ''),
    tag: String(row.tag ?? 'other'),
    subject: row.subject == null ? null : String(row.subject),
    picture: row.picture == null ? null : String(row.picture),
    tile: row.tile == null ? null : String(row.tile),
    createdAt: Number(row.created_at),
    dueAt: Number(row.due_at),
    intervalDays: Number(row.interval_days),
    ease: Number(row.ease),
    repetitions: Number(row.repetitions),
  }
}

export async function listCards(owner = OWNER): Promise<StoredCard[]> {
  await init()
  const r = await db().execute({ sql: 'SELECT * FROM cards WHERE owner = ? ORDER BY created_at DESC', args: [owner] })
  return r.rows.map(row => rowToCard(row as unknown as Record<string, unknown>))
}

/** Insert or replace. A card is identified by its id, so re-sending is safe. */
export async function upsertCards(cards: NewCard[], owner = OWNER): Promise<number> {
  await init()
  if (!cards.length) return 0
  const now = Date.now()
  const stmts = cards.map(c => {
    if (!c.id || !c.greek?.trim() || !c.translation?.trim()) throw new ServiceError(400, 'each card needs an id, greek and translation')
    if (c.picture && c.picture.length > 2_000_000) throw new ServiceError(413, `the picture for ${c.greek} is too large to store`)
    return {
      sql: `INSERT INTO cards (id, owner, folder, greek, article, translation, transliteration, sentence, grammar_note, tag,
                               subject, picture, tile, created_at, due_at, interval_days, ease, repetitions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              folder = excluded.folder, greek = excluded.greek, article = excluded.article,
              translation = excluded.translation, transliteration = excluded.transliteration,
              sentence = excluded.sentence, grammar_note = excluded.grammar_note, tag = excluded.tag,
              subject = excluded.subject, picture = COALESCE(excluded.picture, cards.picture),
              tile = COALESCE(excluded.tile, cards.tile)`,
      args: [
        c.id, owner, c.folder ?? 'recent', c.greek, c.article ?? null, c.translation, c.transliteration ?? '',
        c.sentence ?? '', c.grammarNote ?? '', c.tag ?? 'other', c.subject ?? null, c.picture ?? null, c.tile ?? null,
        c.createdAt ?? now, c.dueAt ?? now, c.intervalDays ?? 1, c.ease ?? 2.5, c.repetitions ?? 0,
      ] as InArgs,
    }
  })
  await db().batch(stmts, 'write')
  return cards.length
}

export async function deleteCards(ids: string[], owner = OWNER): Promise<number> {
  await init()
  if (!ids.length) return 0
  await db().batch(ids.map(id => ({ sql: 'DELETE FROM cards WHERE id = ? AND owner = ?', args: [id, owner] as InArgs })), 'write')
  return ids.length
}

/** Everything the app needs on open, in one round trip. */
export async function getState(owner = OWNER): Promise<{ settings: Settings; cards: StoredCard[] }> {
  const [settings, cards] = await Promise.all([getSettings(owner), listCards(owner)])
  return { settings, cards }
}
