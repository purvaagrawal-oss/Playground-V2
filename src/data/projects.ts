import type { Project } from '@/types'
import { makeThumb, avatarUri } from '@/utils/thumbnails'

export const SEED_PROJECTS: Project[] = [
  {
    id: 'p-beauty-in-black',
    name: 'Beauty in Black',
    description: 'Noir drama series — key art, character looks and promo moments.',
    cover: makeThumb('p-beauty-in-black', 'cinematic', 'Beauty in Black'),
    assetCount: 8,
    updatedAt: '2026-07-22T10:00:00Z',
    members: [avatarUri('Aanya'), avatarUri('Rohan'), avatarUri('Mira')],
  },
  {
    id: 'p-dnr',
    name: 'DNR',
    description: 'Medical thriller — tense scenes and character performances.',
    cover: makeThumb('p-dnr', 'blue', 'DNR'),
    assetCount: 5,
    updatedAt: '2026-07-21T14:00:00Z',
    members: [avatarUri('Aanya'), avatarUri('Kabir')],
  },
  {
    id: 'p-kung-fu-fighters',
    name: 'Kung Fu Fighters',
    description: 'Action series — dynamic fight scenes and stylized promos.',
    cover: makeThumb('p-kung-fu-fighters', 'amber', 'Kung Fu Fighters'),
    assetCount: 6,
    updatedAt: '2026-07-20T09:30:00Z',
    members: [avatarUri('Rohan'), avatarUri('Mira'), avatarUri('Kabir')],
  },
  {
    id: 'p-lunar-ball',
    name: 'Lunar Ball',
    description: 'Sci-fi fantasy — worlds, environments and establishing shots.',
    cover: makeThumb('p-lunar-ball', 'fantasy', 'Lunar Ball'),
    assetCount: 4,
    updatedAt: '2026-07-19T16:45:00Z',
    members: [avatarUri('Aanya'), avatarUri('Mira')],
  },
  {
    id: 'p-nasib-ka-likha',
    name: 'Nasib Ka Likha',
    description: 'Emotional family drama — character portraits and dialogue moments.',
    cover: makeThumb('p-nasib-ka-likha', 'character', 'Nasib Ka Likha'),
    assetCount: 5,
    updatedAt: '2026-07-18T11:15:00Z',
    members: [avatarUri('Kabir'), avatarUri('Rohan')],
  },
  {
    id: 'p-drama-promos',
    name: 'Drama Promos',
    description: 'Cross-show promotional clips and trailer beats.',
    cover: makeThumb('p-drama-promos', 'promo', 'Drama Promos'),
    assetCount: 7,
    updatedAt: '2026-07-17T13:20:00Z',
    members: [avatarUri('Aanya'), avatarUri('Rohan'), avatarUri('Kabir'), avatarUri('Mira')],
  },
]
