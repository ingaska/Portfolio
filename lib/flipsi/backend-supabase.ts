import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ServiceError } from './errors'
import type { Backend, Settings, StoredCard } from './store'

/* The store on Supabase (Postgres), used on sumska.io and, when the same
 * variables are set locally, in development too. The service-role key is
 * used only here, on the server; the tables have row-level security on with
 * no policies, so nothing else can read them.
 *
 * Tables (run once in the Supabase SQL editor; also in docs/supabase.sql):
 *   lexis_settings (owner, key, value jsonb, updated_at)   primary key (owner, key)
 *   lexis_cards    (id primary key, owner, folder, greek, article, translation,
 *                   transliteration, sentence, grammar_note, tag, subject,
 *                   picture, tile, created_at, due_at, interval_days, ease, repetitions)
 *
 * Environment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. */
export function supabaseBackend(): Backend {
  let client: SupabaseClient | null = null
  const db = () => {
    if (!client) {
      const url = process.env.SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !key) throw new ServiceError(503, 'Sync is not set up on this server yet (Supabase variables missing)')
      client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    }
    return client
  }

  const check = <T>(r: { data: T; error: { message: string } | null }): T => {
    if (r.error) throw new ServiceError(502, `Database error: ${r.error.message}`)
    return r.data
  }

  const toRow = (owner: string, c: StoredCard) => ({
    id: c.id, owner, folder: c.folder, greek: c.greek, article: c.article, translation: c.translation,
    transliteration: c.transliteration, sentence: c.sentence, grammar_note: c.grammarNote, tag: c.tag,
    subject: c.subject, picture: c.picture, tile: c.tile, created_at: c.createdAt, due_at: c.dueAt,
    interval_days: c.intervalDays, ease: c.ease, repetitions: c.repetitions,
  })

  const fromRow = (row: Record<string, unknown>): StoredCard => ({
    id: String(row.id),
    folder: String(row.folder),
    greek: String(row.greek),
    article: row.article == null ? null : String(row.article),
    translation: String(row.translation),
    transliteration: String(row.transliteration ?? ''),
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
  })

  return {
    async getSettings(owner) {
      const rows = check(await db().from('lexis_settings').select('key, value').eq('owner', owner))
      const out: Settings = {}
      for (const row of rows ?? []) out[String(row.key)] = row.value
      return out
    },

    async putSettings(owner, patch, now) {
      const rows = Object.entries(patch).map(([key, value]) => ({
        owner, key, value: value ?? null, updated_at: new Date(now).toISOString(),
      }))
      if (rows.length) check(await db().from('lexis_settings').upsert(rows, { onConflict: 'owner,key' }))
    },

    async listCards(owner) {
      const rows = check(await db().from('lexis_cards').select('*').eq('owner', owner).order('created_at', { ascending: false }))
      return (rows ?? []).map(r => fromRow(r as Record<string, unknown>))
    },

    async upsertCards(owner, cards) {
      if (!cards.length) return
      // A card sent without its picture keeps the one already stored (the
      // libSQL backend does this with COALESCE; Postgres upsert cannot).
      const bare = cards.filter(c => !c.picture).map(c => c.id)
      if (bare.length) {
        const kept = check(await db().from('lexis_cards').select('id, picture, tile').eq('owner', owner).in('id', bare))
        const byId = new Map((kept ?? []).map(r => [String(r.id), r]))
        for (const c of cards) {
          const k = byId.get(c.id)
          if (k && !c.picture) { c.picture = k.picture == null ? null : String(k.picture); c.tile = c.tile ?? (k.tile == null ? null : String(k.tile)) }
        }
      }
      check(await db().from('lexis_cards').upsert(cards.map(c => toRow(owner, c)), { onConflict: 'id' }))
    },

    async deleteCards(owner, ids) {
      if (ids.length) check(await db().from('lexis_cards').delete().eq('owner', owner).in('id', ids))
    },

    async deleteAllCards(owner) {
      check(await db().from('lexis_cards').delete().eq('owner', owner))
    },
  }
}
