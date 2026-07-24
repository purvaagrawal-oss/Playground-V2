import type { ElementItem } from '@/types'
import { makeThumb } from '@/utils/thumbnails'

export const SEED_ELEMENTS: ElementItem[] = [
  {
    id: 'el-aanya',
    name: 'Aanya',
    type: 'Character',
    thumbnail: makeThumb('el-aanya', 'character', 'Aanya'),
    description: 'Lead protagonist — early 20s, determined, modern styling.',
    projectIds: ['p-beauty-in-black', 'p-nasib-ka-likha'],
    updatedAt: '2026-07-21T10:00:00Z',
  },
  {
    id: 'el-arjun',
    name: 'Arjun',
    type: 'Character',
    thumbnail: makeThumb('el-arjun', 'character', 'Arjun'),
    description: 'Supporting lead — 30s, brooding, tailored dark wardrobe.',
    projectIds: ['p-dnr', 'p-kung-fu-fighters'],
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'el-royal-palace',
    name: 'Royal Palace',
    type: 'Location',
    thumbnail: makeThumb('el-royal-palace', 'location', 'Royal Palace'),
    description: 'Grand marble palace interior with warm chandeliers.',
    projectIds: ['p-lunar-ball'],
    updatedAt: '2026-07-19T10:00:00Z',
  },
  {
    id: 'el-moonlit-forest',
    name: 'Moonlit Forest',
    type: 'Location',
    thumbnail: makeThumb('el-moonlit-forest', 'fantasy', 'Moonlit Forest'),
    description: 'Dense forest under cool moonlight with drifting mist.',
    projectIds: ['p-lunar-ball', 'p-beauty-in-black'],
    updatedAt: '2026-07-18T10:00:00Z',
  },
  {
    id: 'el-red-sports-car',
    name: 'Red Sports Car',
    type: 'Object',
    thumbnail: makeThumb('el-red-sports-car', 'promo', 'Red Sports Car'),
    description: 'Glossy red convertible, signature hero vehicle.',
    projectIds: ['p-drama-promos'],
    updatedAt: '2026-07-17T10:00:00Z',
  },
  {
    id: 'el-pocketfm-mic',
    name: 'Pocket FM Microphone',
    type: 'Object',
    thumbnail: makeThumb('el-pocketfm-mic', 'product', 'PFM Microphone'),
    description: 'Branded studio microphone prop for promos.',
    projectIds: ['p-drama-promos'],
    updatedAt: '2026-07-16T10:00:00Z',
  },
]
