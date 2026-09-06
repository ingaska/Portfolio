import Anthropic from '@anthropic-ai/sdk'
import { ServiceError } from './errors'

/* CLAUDE.md § API integration — Claude Haiku 4.5 writes the cards. One
 * request covers the whole selection: the model reads the pasted text,
 * picks out the vocabulary worth learning (or takes the words the caller
 * names) and returns every card in a single structured JSON object, so the
 * response never needs parsing by hand. */
const MODEL = 'claude-haiku-4-5-20251001'

/* Haiku 4.5 pricing per million tokens, for the cost line. */
const PRICE = { input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 }

const SYSTEM_PROMPT = `You are a Modern Greek tutor writing spaced-repetition flashcards for an English-speaking learner who reads Greek text in the wild.

You receive either a passage of Greek text or a list of words with the passage as context. Produce one card per vocabulary item.

Choosing words (when no list is given): pick the content words a learner would want on cards: nouns, verbs, adjectives, useful adverbs. Skip articles, pronouns, prepositions, conjunctions, numbers and names. Words listed under "Already in deck" still get a card (the app marks them itself). Merge inflected forms of the same word into one card. Keep the passage order. A single word or a short phrase is a valid passage: make cards for what is there. At most 12 cards. If the passage has no Greek words at all, return an empty list.

Each card:
- greek: the dictionary form (nominative singular for nouns, 1st person singular present for verbs), capitalised, in Greek letters with correct accents.
- article: the definite article for nouns, one of "ο", "η" or "το", or null for anything that is not a noun.
- translation: the concise English sense that fits the passage. One sense only, no lists of alternatives.
- transliteration: the pronunciation in Latin letters between slashes, article included for nouns, with the stress marked by an acute accent: "/o skílos/", "/to korítsi/", "/diavázo/". Use "th" for θ, "ch" for χ, "gh" for γ before back vowels, "d" for δ.
- example_sentence: one short natural Greek sentence using the word. Prefer the sentence from the passage if it is short and clear; otherwise write one a learner could reuse.
- grammar_note: a brief note in English, e.g. "noun, neuter" or "verb, 1st person singular present". Never Greek grammatical terms.
- difficulty_tag: one of "verb", "noun", "adjective", "other".
- image_subject: what a picture dictionary would draw for this word, as a short English phrase (at most 12 words) naming ONE simple, instantly recognisable thing. The rule: a verb or an action gets a person doing it ("a man running with a sports bag"); a word for a person or a role gets that person ("a girl with a backpack"); an object gets the object alone ("a red gift box with a yellow bow"); an abstract word or a natural force gets a plain object as its visual stand-in, never a person or a figure ("air": "three curved wind swooshes carrying two small leaves"; "freedom": "an open birdcage with a small bird flying out"). No text, no symbols, no metaphors that need explaining, no scenes with several elements.
- image_mode: "object" when the picture is one thing (or person) that can be cut out and placed on a coloured tile: things, animals, people, actions. "scene" when the word is a place, an environment, weather, a time of day, a landscape or anything that is by nature a whole view rather than a thing: sky, sea, forest, night, rain, city, beach. A scene fills its picture edge to edge; for "scene", image_subject describes the whole view ("a blue sky with a pale sun and three small clouds").

Examples of finished cards:
{"greek":"Σκύλος","article":"ο","translation":"Dog","transliteration":"/o skílos/","example_sentence":"Ο σκύλος κάθεται και περιμένει","grammar_note":"noun, masculine","difficulty_tag":"noun","image_subject":"a golden retriever standing and facing the viewer","image_mode":"object"}
{"greek":"Διαβάζω","article":null,"translation":"I read","transliteration":"/diavázo/","example_sentence":"Διαβάζω ένα βιβλίο το βράδυ","grammar_note":"verb, 1st person singular present","difficulty_tag":"verb","image_subject":"a young woman sitting and reading an open book","image_mode":"object"}
{"greek":"Ουρανός","article":"ο","translation":"Sky","transliteration":"/o ouranós/","example_sentence":"Ο ουρανός είναι καθαρός σήμερα","grammar_note":"noun, masculine","difficulty_tag":"noun","image_subject":"a blue sky with a pale yellow sun and three small white clouds","image_mode":"scene"}`

const CARD_SCHEMA = {
  type: 'object',
  properties: {
    cards: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          greek: { type: 'string' },
          // No enum here: the validator rejects `null` inside an enum on a
          // string-or-null type. The prompt names the three articles.
          article: { type: ['string', 'null'] },
          translation: { type: 'string' },
          transliteration: { type: 'string' },
          example_sentence: { type: 'string' },
          grammar_note: { type: 'string' },
          difficulty_tag: { type: 'string', enum: ['verb', 'noun', 'adjective', 'other'] },
          image_subject: { type: 'string' },
          image_mode: { type: 'string', enum: ['object', 'scene'] },
        },
        required: ['greek', 'article', 'translation', 'transliteration', 'example_sentence', 'grammar_note', 'difficulty_tag', 'image_subject', 'image_mode'],
        additionalProperties: false,
      },
    },
  },
  required: ['cards'],
  additionalProperties: false,
} as const

export interface GeneratedCard {
  greek: string
  article: string | null
  translation: string
  transliteration: string
  example_sentence: string
  grammar_note: string
  difficulty_tag: 'verb' | 'noun' | 'adjective' | 'other'
  /** What to draw for the card, decided by Claude (see the prompt). */
  image_subject: string
  /** A cut-out on a tile, or a view that fills the picture edge to edge. */
  image_mode: 'object' | 'scene'
  /** True when the word (or its article-less form) is already in the deck. */
  in_deck: boolean
}

export interface WriteCardsInput {
  text?: string
  words?: string[]
  known?: string[]
  apiKey?: string
}

export interface WriteCardsResult {
  cards: GeneratedCard[]
  usage: {
    input_tokens: number
    output_tokens: number
    cache_read_input_tokens: number
    cache_creation_input_tokens: number
  }
  /** US dollars, from Haiku 4.5 list prices. */
  cost: number
}

const norm = (s: string) => s.trim().toLowerCase().replace(/^(ο|η|το)\s+/, '')

export async function writeCards({ text, words, known, apiKey }: WriteCardsInput): Promise<WriteCardsResult> {
  if (!apiKey) throw new ServiceError(400, 'apiKey is required')
  if (!text?.trim() && !words?.length) throw new ServiceError(400, 'text or words is required')

  const knownSet = new Set((known ?? []).map(norm))
  const user =
    (words?.length
      ? `Words: ${words.join(', ')}\n\nContext:\n${text?.trim() || '(none)'}`
      : `Text:\n${text!.trim()}`) +
    (knownSet.size ? `\n\nAlready in deck: ${[...knownSet].join(', ')}` : '')

  const client = new Anthropic({ apiKey })
  const started = Date.now()

  let message: Anthropic.Message
  try {
    message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      // The system prompt is identical on every call, so it carries the cache
      // breakpoint. Haiku 4.5 only caches prefixes of 4096+ tokens; this
      // prompt is well under that, and padding it out would cost more per call
      // than the cache saves. The breakpoint is here for when the prompt grows.
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: user }],
      output_config: { format: { type: 'json_schema', schema: CARD_SCHEMA } },
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new ServiceError(401, 'The Anthropic API key was rejected')
    if (err instanceof Anthropic.RateLimitError) throw new ServiceError(429, 'Anthropic rate limit reached. Wait a minute, then try again')
    if (err instanceof Anthropic.APIError) throw new ServiceError(502, `Anthropic API error ${err.status}: ${err.message}`)
    throw err
  }

  if (message.stop_reason === 'refusal') throw new ServiceError(422, 'Claude declined to write cards for this text')
  const block = message.content.find(b => b.type === 'text')
  if (!block || block.type !== 'text') throw new ServiceError(502, 'No text in the response')

  const parsed = JSON.parse(block.text) as { cards: Omit<GeneratedCard, 'in_deck'>[] }
  const cards: GeneratedCard[] = parsed.cards.map(c => ({ ...c, in_deck: knownSet.has(norm(c.greek)) }))

  const u = message.usage
  const cost =
    (u.input_tokens * PRICE.input +
      u.output_tokens * PRICE.output +
      (u.cache_creation_input_tokens ?? 0) * PRICE.cacheWrite +
      (u.cache_read_input_tokens ?? 0) * PRICE.cacheRead) / 1_000_000

  console.log(`generate: ${cards.length} cards (${cards.filter(c => c.in_deck).length} in deck) from ${(text ?? '').length} chars in ${((Date.now() - started) / 1000).toFixed(1)}s, $${cost.toFixed(5)}`)

  return {
    cards,
    usage: {
      input_tokens: u.input_tokens,
      output_tokens: u.output_tokens,
      cache_read_input_tokens: u.cache_read_input_tokens ?? 0,
      cache_creation_input_tokens: u.cache_creation_input_tokens ?? 0,
    },
    cost,
  }
}
