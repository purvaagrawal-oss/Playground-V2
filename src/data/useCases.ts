import type { UseCase } from '@/types'
import { makeThumb } from '@/utils/thumbnails'

export const IMAGE_USE_CASES: UseCase[] = [
  {
    id: 'img-cinematic',
    mode: 'image',
    title: 'Cinematic Scenes',
    description: 'Create dramatic story moments',
    icon: 'Clapperboard',
    iconColor: '#E5005A',
    category: 'Storytelling',
    thumbnail: makeThumb('img-cinematic', 'cinematic', 'Cinematic'),
    defaults: {
      model: 'Soul Cinema',
      version: 'v1.2',
      aspectRatio: '16:9',
      resolution: '2K',
      style: 'Cinematic',
      outputCount: 1,
    },
    placeholder: 'Describe the characters, setting, emotion and dramatic moment…',
    starter:
      'A cinematic scene of [character] in [location], during [dramatic event], with [lighting and mood]…',
  },
  {
    id: 'img-characters',
    mode: 'image',
    title: 'Characters',
    description: 'Generate consistent characters',
    icon: 'UserRound',
    iconColor: '#A855F7',
    category: 'Characters',
    thumbnail: makeThumb('img-characters', 'character', 'Character'),
    defaults: {
      model: 'Soul Cinema',
      version: 'v1.2',
      aspectRatio: '4:5',
      resolution: '2K',
      style: 'Character portrait',
      outputCount: 2,
    },
    placeholder: "Describe the character's appearance, clothing, age and personality…",
    starter:
      'A consistent character portrait of [name], a [age and role], wearing [clothing], with [expression]…',
  },
  {
    id: 'img-promo',
    mode: 'image',
    title: 'Promo Art',
    description: 'Create covers, posters and campaign art',
    icon: 'Sparkles',
    iconColor: '#2DD4BF',
    category: 'Marketing',
    thumbnail: makeThumb('img-promo', 'promo', 'Promo Art'),
    defaults: {
      model: 'Story Image',
      version: 'v1.2',
      aspectRatio: '4:5',
      resolution: '2K',
      style: 'Promotional',
      outputCount: 2,
    },
    placeholder: 'Describe the promotional visual, title mood and central subject…',
    starter:
      'A premium promotional key art visual for [show], featuring [subject], with [genre] atmosphere…',
  },
  {
    id: 'img-locations',
    mode: 'image',
    title: 'Locations & Worlds',
    description: 'Build settings and establishing shots',
    icon: 'Mountain',
    iconColor: '#F59E0B',
    category: 'Environments',
    thumbnail: makeThumb('img-locations', 'location', 'Locations'),
    defaults: {
      model: 'Soul Cinema',
      version: 'v1.2',
      aspectRatio: '16:9',
      resolution: '2K',
      style: 'Environment',
      outputCount: 1,
    },
    placeholder: 'Describe the location, architecture, time of day and atmosphere…',
    starter:
      'An establishing shot of [location], featuring [architecture and environment], during [time and weather]…',
  },
  {
    id: 'img-product',
    mode: 'image',
    title: 'Product Shots',
    description: 'Create polished object and product imagery',
    icon: 'Package',
    iconColor: '#3B82F6',
    category: 'Objects',
    thumbnail: makeThumb('img-product', 'product', 'Product'),
    defaults: {
      model: 'Product Vision',
      version: 'v1.2',
      aspectRatio: '1:1',
      resolution: '2K',
      style: 'Studio product',
      outputCount: 2,
    },
    placeholder: 'Describe the object, surface, lighting and brand mood…',
    starter: 'A premium studio product shot of [object], placed on [surface], with [lighting style]…',
  },
  {
    id: 'img-stylized',
    mode: 'image',
    title: 'Stylized Art',
    description: 'Explore genre and visual styles',
    icon: 'Palette',
    iconColor: '#84CC16',
    category: 'Style exploration',
    thumbnail: makeThumb('img-stylized', 'stylized', 'Stylized'),
    defaults: {
      model: 'Style Lab',
      version: 'v1.2',
      aspectRatio: '4:5',
      resolution: '2K',
      style: 'Stylized',
      outputCount: 2,
    },
    placeholder: 'Describe the subject, chosen art direction and mood…',
    starter:
      'A stylized illustration of [subject] in a [style or genre] visual language, with [palette and mood]…',
  },
]

export const VIDEO_USE_CASES: UseCase[] = [
  {
    id: 'vid-image-to-video',
    mode: 'video',
    title: 'Image to Video',
    description: 'Animate an approved image',
    icon: 'ImagePlay',
    iconColor: '#E5005A',
    category: 'Animate an image',
    thumbnail: makeThumb('vid-image-to-video', 'promo', 'Image → Video'),
    defaults: {
      model: 'Motion Studio',
      version: 'v1.2',
      aspectRatio: 'Inherit',
      resolution: '1080p',
      duration: '5s',
      startFrame: 'required',
    },
    placeholder: 'Describe how the image should move, what changes and how the camera behaves…',
    starter:
      'Animate this image with [subject motion], [environment motion] and a subtle [camera movement]…',
  },
  {
    id: 'vid-cinematic',
    mode: 'video',
    title: 'Cinematic Scene',
    description: 'Generate a short narrative moment',
    icon: 'Clapperboard',
    iconColor: '#A855F7',
    category: 'Narrative scenes',
    thumbnail: makeThumb('vid-cinematic', 'cinematic', 'Cinematic'),
    defaults: {
      model: 'Motion Studio',
      version: 'v1.2',
      aspectRatio: '16:9',
      resolution: '1080p',
      duration: '5s',
    },
    placeholder: 'Describe the scene, character action, emotion and camera movement…',
    starter:
      'A cinematic shot where [character] [action], in [location], while the camera [movement]…',
  },
  {
    id: 'vid-character',
    mode: 'video',
    title: 'Character Performance',
    description: 'Create expressive character movement',
    icon: 'UserRound',
    iconColor: '#2DD4BF',
    category: 'Character performance',
    thumbnail: makeThumb('vid-character', 'character', 'Performance'),
    defaults: {
      model: 'Motion Studio',
      version: 'v1.2',
      aspectRatio: '4:5',
      resolution: '1080p',
      duration: '5s',
      startFrame: 'recommended',
    },
    placeholder: "Describe the character's expression, body movement and emotional beat…",
    starter:
      'The character [performance], shifting from [emotion] to [emotion], with subtle natural movement…',
  },
  {
    id: 'vid-dialogue',
    mode: 'video',
    title: 'Dialogue Moment',
    description: 'Visualize a character interaction',
    icon: 'MessagesSquare',
    iconColor: '#F59E0B',
    category: 'Dialogue moments',
    thumbnail: makeThumb('vid-dialogue', 'cinematic', 'Dialogue'),
    defaults: {
      model: 'Motion Studio',
      version: 'v1.2',
      aspectRatio: '16:9',
      resolution: '1080p',
      duration: '8s',
      startFrame: 'optional',
    },
    placeholder: 'Describe who is speaking, their emotion, reactions and scene blocking…',
    starter:
      'Two characters in [location] share a tense exchange; [character A action] while [character B reaction]…',
  },
  {
    id: 'vid-promo',
    mode: 'video',
    title: 'Promo or Trailer',
    description: 'Create a short promotional clip',
    icon: 'Megaphone',
    iconColor: '#3B82F6',
    category: 'Promotional clips',
    thumbnail: makeThumb('vid-promo', 'promo', 'Promo / Trailer'),
    defaults: {
      model: 'Motion Studio',
      version: 'v1.2',
      aspectRatio: '9:16',
      resolution: '1080p',
      duration: '8s',
    },
    placeholder: 'Describe the promotional beats, visual energy and key reveal…',
    starter:
      'A fast-paced promotional clip for [show], beginning with [hook], building through [beats], ending on [reveal]…',
  },
  {
    id: 'vid-camera',
    mode: 'video',
    title: 'Camera Motion',
    description: 'Add controlled motion to a shot',
    icon: 'Video',
    iconColor: '#84CC16',
    category: 'Camera movement',
    thumbnail: makeThumb('vid-camera', 'location', 'Camera Motion'),
    defaults: {
      model: 'Motion Studio',
      version: 'v1.2',
      aspectRatio: '16:9',
      resolution: '1080p',
      duration: '5s',
      startFrame: 'recommended',
    },
    placeholder: 'Describe the subject and the intended camera movement…',
    starter:
      'A slow [dolly, pan, orbit or push-in] around [subject], maintaining [mood and focus]…',
  },
]

export const ALL_USE_CASES = [...IMAGE_USE_CASES, ...VIDEO_USE_CASES]

export function getUseCase(id: string | undefined): UseCase | undefined {
  if (!id) return undefined
  return ALL_USE_CASES.find((u) => u.id === id)
}

export function useCasesForMode(mode: 'image' | 'video'): UseCase[] {
  return mode === 'image' ? IMAGE_USE_CASES : VIDEO_USE_CASES
}
