import { cacheKey, type MediaCache } from './cache'
import { cutOutWithReport, dominantHue } from './cutout'
import { ServiceError, googleDetail, googleError } from './errors'

/* Card illustrations, drawn by Gemini's image model with the user's Google
 * key, in the style of the Figma illustration set (node 142:2745): three of
 * those originals go along as reference images, the prompt describes the
 * style in words, and the result is finished one of two ways, as Claude
 * decided when it wrote the card:
 *
 *   object — a cut-out. Gemini is asked for a flat magenta background, which
 *            is keyed out (see cutout.ts); the subject is re-framed to the
 *            set's proportions and placed on the palette tile whose hue
 *            contrasts most with its own.
 *   scene  — a whole view (sky, sea, night) that fills the picture edge to
 *            edge. No key, no tile. */
const MODEL = 'gemini-2.5-flash-image'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

/** Bump when the prompt or references change, so cached pictures are redrawn. */
const STYLE = 'flat-v7'

/** The five tile colours of the Figma set, with their hues. */
export const TILES = [
  { hex: '#48BBEA', hue: 197 },   // blue
  { hex: '#F9D446', hue: 48 },    // yellow
  { hex: '#6155F5', hue: 245 },   // indigo
  { hex: '#00C3D0', hue: 184 },   // teal
  { hex: '#FF8D28', hue: 28 },    // orange
]

/** The background colour Gemini is asked for, keyed out afterwards. It must
 *  be far from anything in the subject: green for most things, magenta for
 *  subjects that are probably green (a pink heart on magenta came back grey). */
const CHROMAS = {
  green:   { hex: '#00FF00', rgb: [0, 255, 0] as [number, number, number], name: 'neon green' },
  magenta: { hex: '#FF00FF', rgb: [255, 0, 255] as [number, number, number], name: 'neon magenta' },
}
const GREENISH = /\b(leaf|leaves|tree|trees|plant|plants|grass|forest|frog|cucumber|lime|olive|olives|green|salad|lettuce|broccoli|pea|peas|mint|cactus|herb|herbs|bush|garden|park|jungle|turtle|lizard|crocodile|kiwi|avocado|pear|melon|watermelon|apple|pepper|spinach|zucchini|basil|dill|parsley|vine|vineyard|meadow|hill|hills|mountain|mountains|field|fields|island|palm)\b/i
const chromaFor = (subject: string) => (GREENISH.test(subject) ? CHROMAS.magenta : CHROMAS.green)

/** The reference illustrations, as Gemini wants them. */
export type ReferencePart = { inlineData: { mimeType: string; data: string } }
export const REFERENCE_FILES = ['ice-cream.png', 'dog.png', 'runner.png']

const STYLE_BRIEF =
  'The attached images are examples of one illustration style. Reproduce that style exactly: a flat two-dimensional ' +
  'drawing with thin dark outlines of even weight, flat bright pastel fills, at most one slightly darker flat tone for ' +
  'simple shading, no gradients, no highlights, no texture, simple rounded friendly shapes. ' +
  'Colours come from the same palette as the examples, light but clearly saturated: sky blue #8CCBEE, sunny yellow #F6D96B, ' +
  'warm sand #E6C79C, coral #F28B82, mint #9EDCC5, lavender #C9B8F0, plus a warm brown #C68B59 and ink #2B2B3A for outlines. ' +
  'Every fill is clean and vivid; nothing muddy, greyish, dusty or desaturated. '

const objectPrompt = (subject: string, chroma: { hex: string; name: string }) =>
  STYLE_BRIEF +
  `In precisely that style, draw only this: ${subject}. ` +
  'Keep it as simple as a picture-dictionary entry: one subject, few details, no decoration, no extra elements, ' +
  'no swirls, sparkles, clouds or accents around it. ' +
  'Composition: the subject is centred and about half the height of the image, with clear empty margin on every side. ' +
  'The subject is complete and entirely inside the picture: nothing is cropped or cut off by any edge. ' +
  'A person or an animal is shown whole, from the top of the head to the feet or shoes, standing on nothing, ' +
  'with empty background below the feet as well as above the head. ' +
  `The background is a vivid, fully saturated ${chroma.name}, exactly ${chroma.hex} (no white or grey mixed in), ` +
  'one perfectly uniform flat colour filling every pixel that is not the subject, ' +
  'including any gaps and holes inside the subject: no ground line, no shadow, no props, no frame or border, ' +
  'and absolutely no text, letters, numbers, labels, captions or watermark anywhere in the image.'

const scenePrompt = (subject: string) =>
  STYLE_BRIEF +
  `In precisely that style, draw this view: ${subject}. ` +
  'It is a full-frame scene: the picture is filled edge to edge with the scene itself, no border, no frame, no box, ' +
  'no card, no panel and no background colour showing around it. Spread the few elements across the whole frame in a ' +
  'balanced way, with generous calm space between them, nothing crowded into one corner or along the bottom edge. ' +
  'Keep it as simple as a picture-dictionary entry: few elements, no decoration, no swirls, sparkles or accents, ' +
  'and absolutely no text, letters, numbers, labels, captions or watermark anywhere in the image.'

/** Appended to the brief when the first render ran into an edge. */
const SMALLER =
  ' IMPORTANT: the previous attempt was cropped at the edge. Draw the subject noticeably smaller, ' +
  'no more than 45% of the image height, fully inside the frame with wide empty margin all around, feet and head included.'

export interface IllustrateInput {
  greek?: string
  translation?: string
  /** From Claude's card (image_subject). Falls back to the translation. */
  subject?: string
  /** From Claude's card (image_mode). */
  mode?: 'object' | 'scene'
  /** Force a tile colour (#RRGGBB) instead of choosing by contrast. */
  tile?: string
  /** Skip the cache and draw again (the card's regenerate button). */
  fresh?: boolean
  apiKey?: string
}

export interface IllustrateResult {
  bytes: Buffer
  mimeType: string
  /** The flat colour a cut-out sits on; null for a full-bleed scene. */
  tile: string | null
  cached: boolean
}

export async function illustrate(
  input: IllustrateInput,
  cache: MediaCache,
  loadReferences: () => Promise<ReferencePart[]>,
): Promise<IllustrateResult> {
  const { greek, translation, subject: requestedSubject, mode = 'object', tile: requested, fresh = false, apiKey } = input
  if (!greek?.trim() || !translation?.trim()) throw new ServiceError(400, 'greek and translation are required')
  if (!apiKey) throw new ServiceError(400, 'apiKey is required')

  const scene = mode === 'scene'
  const subject = requestedSubject?.trim() || `one ${translation.trim().toLowerCase()}`
  const forced = requested && /^#[0-9a-f]{6}$/i.test(requested) ? requested.toUpperCase() : null
  const key = cacheKey('image', MODEL, STYLE, mode, greek.trim(), subject)

  const cached = fresh ? null : await cache.read('image', key, 'png')
  if (cached) return { bytes: cached, mimeType: 'image/png', tile: scene ? null : forced ?? pickTile(dominantHue(cached)), cached: true }

  const references = await loadReferences()
  const chroma = chromaFor(subject)
  const brief = scene ? scenePrompt(subject) : objectPrompt(subject, chroma)
  let drawn = await draw(apiKey, references, brief, scene)

  let bytes: Buffer = drawn.raw
  let mimeType = drawn.mimeType
  let tile: string | null = forced
  if (scene) {
    tile = null
  } else {
    try {
      let cut = cutOutWithReport(drawn.raw, chroma.rgb)
      if (cut.cropped) {
        // The model ran the subject into an edge (legs cut off). One more
        // try, asking for it smaller; the second render is used either way.
        console.warn(`image: "${greek}" was cropped at the edge, redrawing smaller`)
        drawn = await draw(apiKey, references, brief + SMALLER, scene)
        cut = cutOutWithReport(drawn.raw, chroma.rgb)
        if (cut.cropped) console.warn(`image: "${greek}" still touches the edge after the redraw`)
      }
      bytes = cut.bytes
      mimeType = 'image/png'
      tile ??= pickTile(dominantHue(bytes))
    } catch (err) {
      // A JPEG or an odd PNG: keep the picture, skip the transparency.
      console.warn('image: could not cut out the background:', err)
      tile ??= TILES[0].hex
    }
  }
  await cache.write('image', key, 'png', bytes)
  console.log(`image: drew "${greek}" as ${mode} "${subject}" (${Math.round(drawn.raw.length / 1024)} KB → ${Math.round(bytes.length / 1024)} KB)${tile ? ` on ${tile}` : ', full bleed'}`)
  return { bytes, mimeType, tile, cached: false }
}

/** One Gemini image call. */
async function draw(apiKey: string, references: ReferencePart[], text: string, scene: boolean): Promise<{ raw: Buffer; mimeType: string }> {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
    body: JSON.stringify({
      contents: [{ parts: [...references, { text }] }],
      // Scenes fill the card's square picture; objects match the 4:5 reference frame.
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: scene ? '1:1' : '4:5' } },
    }),
  })
  if (!r.ok) {
    const detail = await googleDetail(r)
    console.warn(`image: Gemini answered ${r.status}: ${detail}`)
    throw googleError(r, detail, 'Gemini')
  }
  const body = (await r.json()) as {
    candidates?: { content?: { parts?: { inlineData?: { mimeType: string; data: string } }[] } }[]
  }
  const part = body.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
  if (!part?.inlineData) throw new ServiceError(502, 'Gemini returned no image')
  return { raw: Buffer.from(part.inlineData.data, 'base64'), mimeType: part.inlineData.mimeType }
}

/** The tile whose hue sits farthest from the subject's own, so an orange
 *  gift lands on blue and a blue runner on yellow or orange. A grey subject
 *  (no hue) takes the blue. */
function pickTile(hue: number | null): string {
  if (hue === null) return TILES[0].hex
  const apart = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d }
  return TILES.reduce((best, t) => (apart(t.hue, hue) > apart(best.hue, hue) ? t : best)).hex
}

export const toDataUrl = (bytes: Buffer, mime = 'image/png') => `data:${mime};base64,${bytes.toString('base64')}`
