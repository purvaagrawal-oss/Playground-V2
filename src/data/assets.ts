import type { Asset } from '@/types'
import { makeThumb, PALETTES } from '@/utils/thumbnails'

type PaletteKey = keyof typeof PALETTES

type Seed = {
  title: string
  type: 'image' | 'video'
  palette: PaletteKey
  prompt: string
  useCaseId?: string
  useCaseTitle?: string
  model: string
  version: string
  aspectRatio: string
  resolution: string
  duration?: string
  outputCount: number
  projectId: string | null
  elementIds?: string[]
  favourite?: boolean
  creator?: string
  daysAgo: number
}

const SEEDS: Seed[] = [
  { title: 'Rain-soaked confrontation', type: 'image', palette: 'cinematic', prompt: 'A cinematic scene of two rivals facing each other in a rain-soaked alley at night, neon reflections, tense standoff, dramatic rim lighting.', useCaseId: 'img-cinematic', useCaseTitle: 'Cinematic Scenes', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '16:9', resolution: '2K', outputCount: 1, projectId: 'p-beauty-in-black', elementIds: ['el-aanya'], favourite: true, daysAgo: 1 },
  { title: 'Aanya — hero portrait', type: 'image', palette: 'character', prompt: 'A consistent character portrait of Aanya, a determined young woman, wearing a tailored black coat, with a resolute expression, soft studio light.', useCaseId: 'img-characters', useCaseTitle: 'Characters', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '4:5', resolution: '2K', outputCount: 2, projectId: 'p-beauty-in-black', elementIds: ['el-aanya'], favourite: true, daysAgo: 1 },
  { title: 'Beauty in Black — key art', type: 'image', palette: 'promo', prompt: 'A premium promotional key art visual for Beauty in Black, featuring the lead in shadow, with noir drama atmosphere and bold title space.', useCaseId: 'img-promo', useCaseTitle: 'Promo Art', model: 'Story Image', version: 'v1.2', aspectRatio: '4:5', resolution: '2K', outputCount: 2, projectId: 'p-beauty-in-black', daysAgo: 2 },
  { title: 'Moonlit forest clearing', type: 'image', palette: 'fantasy', prompt: 'An establishing shot of a moonlit forest clearing, featuring towering trees and drifting mist, during a cold clear night.', useCaseId: 'img-locations', useCaseTitle: 'Locations & Worlds', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '16:9', resolution: '2K', outputCount: 1, projectId: 'p-lunar-ball', elementIds: ['el-moonlit-forest'], daysAgo: 3 },
  { title: 'Hero microphone product shot', type: 'image', palette: 'product', prompt: 'A premium studio product shot of a Pocket FM branded microphone, placed on a reflective black surface, with soft key lighting.', useCaseId: 'img-product', useCaseTitle: 'Product Shots', model: 'Product Vision', version: 'v1.1', aspectRatio: '1:1', resolution: '2K', outputCount: 2, projectId: 'p-drama-promos', elementIds: ['el-pocketfm-mic'], daysAgo: 3 },
  { title: 'Stylized warrior poster', type: 'image', palette: 'stylized', prompt: 'A stylized illustration of a lone warrior in an ink-wash visual language, with a muted red and black palette and dramatic mood.', useCaseId: 'img-stylized', useCaseTitle: 'Stylized Art', model: 'Style Lab', version: 'v0.9', aspectRatio: '4:5', resolution: '2K', outputCount: 2, projectId: 'p-kung-fu-fighters', favourite: true, daysAgo: 4 },
  { title: 'Palace throne reveal', type: 'image', palette: 'location', prompt: 'An establishing shot of a grand marble palace throne room, warm chandeliers, golden hour light through tall windows.', useCaseId: 'img-locations', useCaseTitle: 'Locations & Worlds', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '16:9', resolution: '2K', outputCount: 1, projectId: 'p-lunar-ball', elementIds: ['el-royal-palace'], daysAgo: 4 },
  { title: 'Arjun — brooding close-up', type: 'image', palette: 'character', prompt: 'A consistent character portrait of Arjun, a brooding man in his 30s, wearing a dark tailored suit, with an intense expression.', useCaseId: 'img-characters', useCaseTitle: 'Characters', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '4:5', resolution: '2K', outputCount: 2, projectId: 'p-dnr', elementIds: ['el-arjun'], daysAgo: 5 },
  { title: 'Neon city rooftop', type: 'image', palette: 'urban', prompt: 'A cinematic scene on a neon city rooftop at night, distant skyline, wind-swept coat, moody teal and magenta lighting.', useCaseId: 'img-cinematic', useCaseTitle: 'Cinematic Scenes', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '16:9', resolution: '2K', outputCount: 1, projectId: 'p-beauty-in-black', daysAgo: 5 },
  { title: 'Red sports car reveal', type: 'image', palette: 'promo', prompt: 'A premium studio product shot of a glossy red convertible, dramatic garage lighting, cinematic reflections.', useCaseId: 'img-product', useCaseTitle: 'Product Shots', model: 'Product Vision', version: 'v1.1', aspectRatio: '1:1', resolution: '2K', outputCount: 2, projectId: 'p-drama-promos', elementIds: ['el-red-sports-car'], daysAgo: 6 },
  { title: 'Foggy harbor morning', type: 'image', palette: 'blue', prompt: 'An establishing shot of a foggy harbor at dawn, silhouetted boats, cold blue palette, calm and cinematic.', useCaseId: 'img-locations', useCaseTitle: 'Locations & Worlds', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '16:9', resolution: '2K', outputCount: 1, projectId: 'p-dnr', daysAgo: 6 },
  { title: 'Golden temple courtyard', type: 'image', palette: 'amber', prompt: 'An establishing shot of a golden temple courtyard at sunset, intricate carvings, warm amber light and long shadows.', useCaseId: 'img-locations', useCaseTitle: 'Locations & Worlds', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '16:9', resolution: '2K', outputCount: 1, projectId: 'p-nasib-ka-likha', daysAgo: 7 },
  { title: 'Family dinner tension', type: 'image', palette: 'cinematic', prompt: 'A cinematic scene of a tense family dinner, warm practical lights, emotional glances, shallow depth of field.', useCaseId: 'img-cinematic', useCaseTitle: 'Cinematic Scenes', model: 'Soul Cinema', version: 'v1.2', aspectRatio: '16:9', resolution: '2K', outputCount: 1, projectId: 'p-nasib-ka-likha', daysAgo: 7 },
  { title: 'Stylized fight silhouettes', type: 'image', palette: 'stylized', prompt: 'A stylized illustration of two fighters mid-clash as silhouettes, bold graphic composition, red accent palette.', useCaseId: 'img-stylized', useCaseTitle: 'Stylized Art', model: 'Style Lab', version: 'v0.9', aspectRatio: '4:5', resolution: '2K', outputCount: 2, projectId: 'p-kung-fu-fighters', daysAgo: 8 },

  // Videos
  { title: 'Alley standoff — animated', type: 'video', palette: 'cinematic', prompt: 'Animate this image with subtle rain motion, flickering neon and a slow push-in camera movement.', useCaseId: 'vid-image-to-video', useCaseTitle: 'Image to Video', model: 'Motion Studio', version: 'v1.2', aspectRatio: '16:9', resolution: '1080p', duration: '5s', outputCount: 1, projectId: 'p-beauty-in-black', favourite: true, daysAgo: 2 },
  { title: 'Aanya turns to camera', type: 'video', palette: 'character', prompt: 'The character shifts from contemplative to resolute, turning slowly toward camera with subtle natural movement.', useCaseId: 'vid-character', useCaseTitle: 'Character Performance', model: 'Performer', version: 'v1.1', aspectRatio: '4:5', resolution: '1080p', duration: '5s', outputCount: 1, projectId: 'p-beauty-in-black', elementIds: ['el-aanya'], daysAgo: 3 },
  { title: 'Rooftop dialogue exchange', type: 'video', palette: 'urban', prompt: 'Two characters on a rooftop share a tense exchange; one steps forward while the other holds ground.', useCaseId: 'vid-dialogue', useCaseTitle: 'Dialogue Moment', model: 'Motion Studio', version: 'v1.2', aspectRatio: '16:9', resolution: '1080p', duration: '8s', outputCount: 1, projectId: 'p-dnr', daysAgo: 4 },
  { title: 'Kung Fu promo trailer', type: 'video', palette: 'amber', prompt: 'A fast-paced promotional clip for Kung Fu Fighters, beginning with a fist reveal, building through action beats, ending on the title.', useCaseId: 'vid-promo', useCaseTitle: 'Promo or Trailer', model: 'Motion Studio', version: 'v1.2', aspectRatio: '9:16', resolution: '1080p', duration: '8s', outputCount: 1, projectId: 'p-kung-fu-fighters', favourite: true, daysAgo: 5 },
  { title: 'Palace orbit shot', type: 'video', palette: 'location', prompt: 'A slow orbit around the palace throne, maintaining a regal mood and warm focus.', useCaseId: 'vid-camera', useCaseTitle: 'Camera Motion', model: 'Motion Studio', version: 'v1.2', aspectRatio: '16:9', resolution: '1080p', duration: '5s', outputCount: 1, projectId: 'p-lunar-ball', elementIds: ['el-royal-palace'], daysAgo: 6 },
  { title: 'Forest push-in reveal', type: 'video', palette: 'fantasy', prompt: 'A slow push-in through the moonlit forest, drifting mist, subtle camera float toward a clearing.', useCaseId: 'vid-cinematic', useCaseTitle: 'Cinematic Scene', model: 'Motion Studio', version: 'v1.2', aspectRatio: '16:9', resolution: '1080p', duration: '5s', outputCount: 1, projectId: 'p-lunar-ball', elementIds: ['el-moonlit-forest'], daysAgo: 6 },
  { title: 'Car drive-by promo', type: 'video', palette: 'promo', prompt: 'A promotional clip of the red sports car driving by, motion blur, dramatic lighting sweep, ending on a badge close-up.', useCaseId: 'vid-promo', useCaseTitle: 'Promo or Trailer', model: 'Motion Studio', version: 'v1.2', aspectRatio: '9:16', resolution: '1080p', duration: '8s', outputCount: 1, projectId: 'p-drama-promos', elementIds: ['el-red-sports-car'], daysAgo: 7 },
  { title: 'Harbor time-lapse mood', type: 'video', palette: 'blue', prompt: 'A cinematic shot where fog rolls across the harbor at dawn while the camera slowly pans right.', useCaseId: 'vid-cinematic', useCaseTitle: 'Cinematic Scene', model: 'Motion Studio', version: 'v1.2', aspectRatio: '16:9', resolution: '1080p', duration: '5s', outputCount: 1, projectId: 'p-dnr', daysAgo: 8 },
  { title: 'Temple sunset dolly', type: 'video', palette: 'amber', prompt: 'A slow dolly across the temple courtyard at sunset, long shadows, warm cinematic grade.', useCaseId: 'vid-camera', useCaseTitle: 'Camera Motion', model: 'Motion Studio', version: 'v1.2', aspectRatio: '16:9', resolution: '1080p', duration: '5s', outputCount: 1, projectId: 'p-nasib-ka-likha', daysAgo: 9 },
  { title: 'Drama promo montage', type: 'video', palette: 'cinematic', prompt: 'A fast-paced promo montage across shows, energetic cuts, building to a shared brand reveal.', useCaseId: 'vid-promo', useCaseTitle: 'Promo or Trailer', model: 'Motion Studio', version: 'v1.2', aspectRatio: '9:16', resolution: '1080p', duration: '8s', outputCount: 1, projectId: 'p-drama-promos', daysAgo: 9 },
]

function isoDaysAgo(days: number): string {
  const d = new Date('2026-07-24T08:00:00Z')
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const SEED_ASSETS: Asset[] = SEEDS.map((s, i) => ({
  id: `a-${i + 1}`,
  title: s.title,
  type: s.type,
  thumbnail: makeThumb(`a-${i + 1}-${s.title}`, s.palette, s.title),
  duration: s.type === 'video' ? s.duration ?? '5s' : undefined,
  prompt: s.prompt,
  useCaseId: s.useCaseId,
  useCaseTitle: s.useCaseTitle,
  model: s.model,
  version: s.version,
  aspectRatio: s.aspectRatio,
  resolution: s.resolution,
  outputCount: s.outputCount,
  projectId: s.projectId,
  creator: s.creator ?? 'Aanya',
  createdAt: isoDaysAgo(s.daysAgo),
  references: [],
  elementIds: s.elementIds ?? [],
  favourite: s.favourite ?? false,
  status: 'ready' as const,
}))

// Extra pool used by "Load more".
export const MORE_ASSETS: Asset[] = Array.from({ length: 10 }).map((_, i) => {
  const palettes = ['cinematic', 'character', 'promo', 'location', 'product', 'stylized', 'urban', 'fantasy', 'blue', 'amber'] as const
  const type: 'image' | 'video' = i % 3 === 0 ? 'video' : 'image'
  const titles = ['Extra story beat', 'Extra character look', 'Extra promo frame', 'Extra environment', 'Extra product angle', 'Extra style test', 'Extra city scene', 'Extra fantasy world', 'Extra harbor shot', 'Extra sunset take']
  return {
    id: `a-more-${i + 1}`,
    title: titles[i],
    type,
    thumbnail: makeThumb(`a-more-${i + 1}`, palettes[i], titles[i]),
    duration: type === 'video' ? '5s' : undefined,
    prompt: `A generated ${type} exploring ${titles[i].toLowerCase()} with cinematic lighting and mood.`,
    useCaseId: type === 'video' ? 'vid-cinematic' : 'img-cinematic',
    useCaseTitle: type === 'video' ? 'Cinematic Scene' : 'Cinematic Scenes',
    model: type === 'video' ? 'Motion Studio' : 'Soul Cinema',
    version: 'v1.2',
    aspectRatio: '16:9',
    resolution: type === 'video' ? '1080p' : '2K',
    outputCount: 1,
    projectId: null,
    creator: 'Aanya',
    createdAt: isoDaysAgo(10 + i),
    references: [],
    elementIds: [],
    favourite: false,
    status: 'ready' as const,
  }
})
