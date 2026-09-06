import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

/* Where generated media (audio, pictures) is kept so the same word never
 * pays for the same file twice. Local Express keeps it in server/cache/,
 * which is git-ignored; on Vercel it lands in /tmp, which lives as long as
 * the function instance does: a best effort, never a promise. */
export interface MediaCache {
  read(kind: string, key: string, ext: string): Promise<Buffer | null>
  write(kind: string, key: string, ext: string, data: Buffer): Promise<void>
}

export function cacheKey(...parts: string[]): string {
  return createHash('sha1').update(parts.join(' ')).digest('hex')
}

export function diskCache(root: string): MediaCache {
  return {
    async read(kind, key, ext) {
      try {
        return await readFile(path.join(root, kind, `${key}.${ext}`))
      } catch {
        return null
      }
    },
    async write(kind, key, ext, data) {
      try {
        const dir = path.join(root, kind)
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, `${key}.${ext}`), data)
      } catch (err) {
        console.warn('cache: could not write', kind, key, err)
      }
    },
  }
}

export const noCache: MediaCache = {
  read: async () => null,
  write: async () => {},
}
