export interface ModelOption {
  name: string
  blurb: string
  mode: 'image' | 'video'
  versions: string[]
  supportsEndFrame?: boolean
}

export const IMAGE_MODELS: ModelOption[] = [
  { name: 'Soul Cinema', blurb: 'Cinematic scenes and characters', mode: 'image', versions: ['v1.2', 'v1.1', 'v1.0'] },
  { name: 'Story Image', blurb: 'Promotional and narrative art', mode: 'image', versions: ['v1.2', 'v1.0'] },
  { name: 'Product Vision', blurb: 'Objects and product shots', mode: 'image', versions: ['v1.1', 'v1.0'] },
  { name: 'Style Lab', blurb: 'Stylized visual exploration', mode: 'image', versions: ['v0.9'] },
]

export const VIDEO_MODELS: ModelOption[] = [
  { name: 'Motion Studio', blurb: 'Cinematic scenes and image-to-video', mode: 'video', versions: ['v1.2', 'v1.1'], supportsEndFrame: true },
  { name: 'Motion Lite', blurb: 'Fast drafts and quick previews', mode: 'video', versions: ['v1.0'] },
  { name: 'Performer', blurb: 'Expressive character movement', mode: 'video', versions: ['v1.1', 'v1.0'], supportsEndFrame: true },
]

export const ASPECT_RATIOS_IMAGE = ['16:9', '4:5', '1:1', '9:16', '3:2']
export const ASPECT_RATIOS_VIDEO = ['16:9', '9:16', '4:5', '1:1', 'Inherit']
export const RESOLUTIONS_IMAGE = ['1K', '2K', '4K']
export const RESOLUTIONS_VIDEO = ['720p', '1080p', '4K']
export const DURATIONS = ['3s', '5s', '8s', '10s']
export const STYLES = ['Cinematic', 'Character portrait', 'Promotional', 'Environment', 'Studio product', 'Stylized', 'Natural']
export const LIGHTING = ['Natural', 'Golden hour', 'Studio', 'Low-key', 'High-key', 'Neon']

export function modelsForMode(mode: 'image' | 'video'): ModelOption[] {
  return mode === 'image' ? IMAGE_MODELS : VIDEO_MODELS
}

export function modelSupportsEndFrame(name: string): boolean {
  return [...IMAGE_MODELS, ...VIDEO_MODELS].find((m) => m.name === name)?.supportsEndFrame ?? false
}
