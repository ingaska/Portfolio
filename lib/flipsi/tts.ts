import { cacheKey, type MediaCache } from './cache'
import { ServiceError, googleDetail, googleError } from './errors'

/* Pronunciation for the speaker button, via Google Cloud Text-to-Speech.
 * The Google key the user pastes in Settings is forwarded to Google and
 * nowhere else. Audio is cached by text + voice, so each word is synthesised
 * once per cache. */
const ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize'
const DEFAULT_VOICE = 'el-GR-Wavenet-A'

export interface SpeakInput {
  text?: string
  apiKey?: string
  voice?: string
}

export async function synthesize({ text, apiKey, voice = DEFAULT_VOICE }: SpeakInput, cache: MediaCache): Promise<{ mp3: Buffer; cached: boolean }> {
  if (!text?.trim()) throw new ServiceError(400, 'text is required')
  if (!apiKey) throw new ServiceError(400, 'apiKey is required')
  if (text.length > 400) throw new ServiceError(400, 'text is too long for one clip (400 characters max)')

  const key = cacheKey('tts', voice, text.trim())
  const cached = await cache.read('tts', key, 'mp3')
  if (cached) return { mp3: cached, cached: true }

  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
    body: JSON.stringify({
      input: { text: text.trim() },
      voice: { languageCode: 'el-GR', name: voice },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.92 },
    }),
  })
  if (!r.ok) {
    const detail = await googleDetail(r)
    console.warn(`tts: Google answered ${r.status} for "${text}": ${detail}`)
    throw googleError(r, detail, 'Google Text-to-Speech')
  }
  const { audioContent } = (await r.json()) as { audioContent: string }
  const mp3 = Buffer.from(audioContent, 'base64')
  await cache.write('tts', key, 'mp3', mp3)
  console.log(`tts: spoke "${text}" with ${voice}, ${Math.round(mp3.length / 1024)} KB`)
  return { mp3, cached: false }
}
