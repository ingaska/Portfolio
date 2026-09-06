import { PNG } from 'pngjs'

/* Turns a subject-on-chroma-background picture into a transparent cut-out
 * framed like the Figma illustration set (node 142:2745), whose originals are
 * 843×1049 with the subject about two-thirds of the height, centred, sitting
 * a little below the middle.
 *
 * Gemini cannot return transparency, so it is asked for a flat magenta
 * background, a colour the flat style never uses. Every pixel near that
 * colour is cleared, enclosed holes included (the gaps in a bow), while white
 * parts of the subject (a t-shirt) are far from magenta and survive. Partly
 * transparent edge pixels have the magenta un-mixed out of them so outlines
 * keep their anti-aliasing without a pink fringe. */

/** Output frame: the reference set's proportions. */
const FRAME = { width: 843, height: 1049 }
/** How much of the frame the subject occupies, and where its centre sits. */
const FIT = { height: 0.66, width: 0.76, centreY: 0.54 }

export function cutOut(pngBytes: Buffer, chroma?: [number, number, number]): Buffer {
  return cutOutWithReport(pngBytes, chroma).bytes
}

/** Like cutOut, and also says whether the subject touches the picture's edge,
 *  which means the model cropped it (legs cut off) and a redraw is worth it. */
export function cutOutWithReport(pngBytes: Buffer, chroma?: [number, number, number]): { bytes: Buffer; cropped: boolean } {
  const img = PNG.sync.read(pngBytes)
  const { width: w, height: h, data } = img

  // The background colour: what was asked for, corrected towards what the
  // border actually contains, since the model may not hit the hex exactly.
  const bg = chroma ? refine(img, chroma) : borderMedian(img)

  // A background that came back as the vivid chroma asked for can be keyed
  // generously: nothing in the subject is near it. One that drifted to a muted
  // tone (a dusty mauve) may sit close to skin, hair or pastel fills, so the
  // tolerance narrows to protect them.
  const drifted = chroma ? Math.hypot(bg[0] - chroma[0], bg[1] - chroma[1], bg[2] - chroma[2]) > 90 : true
  const CLEAR = drifted ? 28 : 60    // within this distance: fully transparent
  const KEEP = drifted ? 70 : 150    // beyond this: fully opaque
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    const d = Math.hypot(data[o] - bg[0], data[o + 1] - bg[1], data[o + 2] - bg[2])
    if (d <= CLEAR) { data[o + 3] = 0; continue }
    if (d >= KEEP) continue
    const a = (d - CLEAR) / (KEEP - CLEAR)
    // Un-mix the background out of the edge pixel.
    for (let c = 0; c < 3; c++) data[o + c] = clamp((data[o + c] - (1 - a) * bg[c]) / a)
    data[o + 3] = Math.round(a * 255)
  }

  despeckle(img)
  return { bytes: PNG.sync.write(reframe(img), { colorType: 6 }), cropped: touchesEdge(img) }
}

/** True when opaque pixels sit within a few pixels of any edge. */
function touchesEdge(img: PNG): boolean {
  const { width: w, height: h, data } = img
  const opaque = (x: number, y: number) => data[(y * w + x) * 4 + 3] > 128
  const margin = Math.max(2, Math.round(Math.min(w, h) * 0.01))
  let hits = 0
  for (let x = 0; x < w; x++) for (let m = 0; m < margin; m++) { if (opaque(x, m)) hits++; if (opaque(x, h - 1 - m)) hits++ }
  for (let y = 0; y < h; y++) for (let m = 0; m < margin; m++) { if (opaque(m, y)) hits++; if (opaque(w - 1 - m, y)) hits++ }
  // A handful of pixels is noise; a run of them is a limb against the edge.
  return hits > Math.min(w, h) * 0.05
}

/** Clears islands of opaque pixels smaller than 0.2% of the image: stray
 *  specks the key missed, which would otherwise stretch the framing box. */
function despeckle(img: PNG): void {
  const { width: w, height: h, data } = img
  const minSize = Math.round(w * h * 0.002)
  const seen = new Uint8Array(w * h)
  const opaque = (i: number) => data[i * 4 + 3] > 8
  for (let start = 0; start < w * h; start++) {
    if (seen[start] || !opaque(start)) continue
    const island: number[] = [start]
    seen[start] = 1
    for (let k = 0; k < island.length; k++) {
      const i = island[k]
      const x = i % w, y = (i - x) / w
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (j >= 0 && !seen[j] && opaque(j)) { seen[j] = 1; island.push(j) }
      }
    }
    if (island.length < minSize) for (const i of island) data[i * 4 + 3] = 0
  }
}

/** Average hue of the subject's coloured pixels (saturation-weighted), or null
 *  for a grey subject. 0–360. */
export function dominantHue(pngBytes: Buffer): number | null {
  const { width: w, height: h, data } = PNG.sync.read(pngBytes)
  let x = 0, y = 0
  for (let i = 0; i < w * h; i++) {
    const o = i * 4
    if (data[o + 3] < 200) continue
    const r = data[o] / 255, g = data[o + 1] / 255, b = data[o + 2] / 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min
    if (delta < 0.18) continue                        // grey, near-white, near-black: no vote
    let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
    hue = ((hue * 60) + 360) % 360
    const weight = delta
    x += Math.cos((hue * Math.PI) / 180) * weight
    y += Math.sin((hue * Math.PI) / 180) * weight
  }
  if (Math.hypot(x, y) < 1) return null
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

/* ---- helpers ------------------------------------------------------------ */

function reframe(img: PNG): PNG {
  const { width: w, height: h, data } = img
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return img

  const subjectW = maxX - minX + 1, subjectH = maxY - minY + 1
  const scale = Math.min((FRAME.height * FIT.height) / subjectH, (FRAME.width * FIT.width) / subjectW)
  const outW = Math.round(subjectW * scale), outH = Math.round(subjectH * scale)
  const left = Math.round((FRAME.width - outW) / 2)
  const top = Math.round(FRAME.height * FIT.centreY - outH / 2)

  const out = new PNG({ width: FRAME.width, height: FRAME.height })
  out.data.fill(0)
  for (let oy = 0; oy < outH; oy++) {
    const ty = top + oy
    if (ty < 0 || ty >= FRAME.height) continue
    for (let ox = 0; ox < outW; ox++) {
      const tx = left + ox
      if (tx < 0 || tx >= FRAME.width) continue
      const px = sample(img, minX + (ox + 0.5) / scale - 0.5, minY + (oy + 0.5) / scale - 0.5)
      out.data.set(px, (ty * FRAME.width + tx) * 4)
    }
  }
  return out
}

/** Bilinear sample with premultiplied alpha, so transparent neighbours do not
 *  darken the edges. */
function sample(img: PNG, fx: number, fy: number): Uint8Array {
  const { width: w, height: h, data } = img
  const x0 = Math.floor(fx), y0 = Math.floor(fy)
  const tx = fx - x0, ty = fy - y0
  const acc = [0, 0, 0, 0]
  for (const [dx, dy, wgt] of [[0, 0, (1 - tx) * (1 - ty)], [1, 0, tx * (1 - ty)], [0, 1, (1 - tx) * ty], [1, 1, tx * ty]]) {
    const x = Math.min(w - 1, Math.max(0, x0 + dx)), y = Math.min(h - 1, Math.max(0, y0 + dy))
    const o = (y * w + x) * 4
    const a = data[o + 3] / 255
    acc[0] += data[o] * a * wgt
    acc[1] += data[o + 1] * a * wgt
    acc[2] += data[o + 2] * a * wgt
    acc[3] += a * wgt
  }
  const a = acc[3]
  return Uint8Array.from(a > 0 ? [acc[0] / a, acc[1] / a, acc[2] / a, a * 255] : [0, 0, 0, 0], v => clamp(v))
}

/** Median of the border pixels: the background of a picture with an unknown one. */
function borderMedian(img: PNG): number[] {
  const { width: w, height: h, data } = img
  const px = (x: number, y: number) => { const o = (y * w + x) * 4; return [data[o], data[o + 1], data[o + 2]] }
  const border: number[][] = []
  for (let x = 0; x < w; x++) border.push(px(x, 0), px(x, h - 1))
  for (let y = 0; y < h; y++) border.push(px(0, y), px(w - 1, y))
  return [0, 1, 2].map(c => median(border.map(p => p[c])))
}

/** The background to key on. The model rarely paints the requested hex and
 *  sometimes drifts far from it (a dusty mauve for magenta), so whatever flat
 *  colour fills the border wins whenever the border is uniform; the requested
 *  chroma is only the fallback for a border that is not one colour. */
function refine(img: PNG, chroma: [number, number, number]): number[] {
  const { width: w, height: h, data } = img
  const actual = borderMedian(img)
  let near = 0, count = 0
  const check = (x: number, y: number) => {
    const o = (y * w + x) * 4
    count++
    if (Math.hypot(data[o] - actual[0], data[o + 1] - actual[1], data[o + 2] - actual[2]) < 40) near++
  }
  for (let x = 0; x < w; x++) { check(x, 0); check(x, h - 1) }
  for (let y = 0; y < h; y++) { check(0, y); check(w - 1, y) }
  return near / count > 0.85 ? actual : [...chroma]
}

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
