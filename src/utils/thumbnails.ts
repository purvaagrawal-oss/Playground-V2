// Deterministic, polished gradient thumbnails rendered as inline SVG data URIs.
// This keeps the prototype fully offline and guarantees no broken-image icons.

export type Palette = {
  a: string
  b: string
  c: string
}

export const PALETTES: Record<string, Palette> = {
  cinematic: { a: '#3b1d3a', b: '#7a1f4b', c: '#1a0f1f' },
  character: { a: '#2b2140', b: '#6d4aa8', c: '#161226' },
  promo: { a: '#5a1030', b: '#e5005a', c: '#2a0a1c' },
  location: { a: '#0f2a3a', b: '#1f7a86', c: '#0a1620' },
  product: { a: '#2a2a33', b: '#b08d57', c: '#141418' },
  stylized: { a: '#1c3a1c', b: '#7bb02f', c: '#101a10' },
  urban: { a: '#20242e', b: '#4a6a9a', c: '#0e1016' },
  fantasy: { a: '#301a4a', b: '#a94ad0', c: '#160e26' },
  amber: { a: '#3a2410', b: '#e0932f', c: '#1a1206' },
  teal: { a: '#0d2e30', b: '#2fb0a8', c: '#08181a' },
  blue: { a: '#122036', b: '#3a72d0', c: '#0a1220' },
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function makeThumb(
  seed: string,
  paletteKey: keyof typeof PALETTES = 'cinematic',
  label?: string,
): string {
  const p = PALETTES[paletteKey] ?? PALETTES.cinematic
  const h = hashString(seed)
  const angle = h % 360
  const cx = 20 + (h % 60)
  const cy = 20 + ((h >> 3) % 55)
  const gid = `g${h % 100000}`
  const rid = `r${h % 100000}`
  const nid = `n${h % 100000}`

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='800' viewBox='0 0 640 800'>
  <defs>
    <linearGradient id='${gid}' gradientTransform='rotate(${angle} 0.5 0.5)'>
      <stop offset='0%' stop-color='${p.a}'/>
      <stop offset='55%' stop-color='${p.b}'/>
      <stop offset='100%' stop-color='${p.c}'/>
    </linearGradient>
    <radialGradient id='${rid}' cx='${cx}%' cy='${cy}%' r='70%'>
      <stop offset='0%' stop-color='rgba(255,255,255,0.28)'/>
      <stop offset='45%' stop-color='rgba(255,255,255,0.05)'/>
      <stop offset='100%' stop-color='rgba(0,0,0,0.0)'/>
    </radialGradient>
    <filter id='${nid}'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer><feFuncA type='linear' slope='0.05'/></feComponentTransfer>
      <feComposite operator='over' in2='SourceGraphic'/>
    </filter>
  </defs>
  <rect width='640' height='800' fill='url(#${gid})'/>
  <rect width='640' height='800' fill='url(#${rid})'/>
  <rect width='640' height='800' filter='url(#${nid})' opacity='0.6'/>
  <rect width='640' height='800' fill='url(#${gid})' opacity='0.12'/>
  ${
    label
      ? `<text x='36' y='740' font-family='Inter, sans-serif' font-size='30' font-weight='600' fill='rgba(255,255,255,0.82)'>${escapeXml(
          label,
        )}</text>`
      : ''
  }
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function avatarUri(name: string): string {
  const h = hashString(name)
  const hue = h % 360
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
    <defs><linearGradient id='av${h % 9999}' gradientTransform='rotate(45 .5 .5)'>
      <stop offset='0%' stop-color='hsl(${hue} 60% 45%)'/>
      <stop offset='100%' stop-color='hsl(${(hue + 40) % 360} 60% 30%)'/>
    </linearGradient></defs>
    <rect width='80' height='80' rx='40' fill='url(#av${h % 9999})'/>
    <text x='40' y='52' font-family='Inter, sans-serif' font-size='32' font-weight='600' fill='white' text-anchor='middle'>${escapeXml(
      initials,
    )}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
