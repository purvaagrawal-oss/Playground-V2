export type Mode = 'image' | 'video'

export type AssetType = 'image' | 'video'

export type AssetStatus = 'ready' | 'generating' | 'cancelled'

export type ElementType = 'Character' | 'Location' | 'Object'

export interface Reference {
  id: string
  assetId?: string
  thumbnail: string
  label: string
  role?: 'reference' | 'startFrame' | 'endFrame'
}

export interface Asset {
  id: string
  title: string
  type: AssetType
  thumbnail: string
  duration?: string
  prompt: string
  useCaseId?: string
  useCaseTitle?: string
  model: string
  version: string
  aspectRatio: string
  resolution: string
  outputCount: number
  projectId: string | null
  creator: string
  createdAt: string
  references: Reference[]
  elementIds: string[]
  favourite: boolean
  status: AssetStatus
  progress?: number
}

export interface UseCaseDefaults {
  model: string
  version: string
  aspectRatio: string
  resolution: string
  style?: string
  outputCount?: number
  duration?: string
  startFrame?: 'required' | 'recommended' | 'optional'
}

export interface UseCase {
  id: string
  mode: Mode
  title: string
  description: string
  icon: string
  iconColor: string
  defaults: UseCaseDefaults
  placeholder: string
  starter: string
  category: string
  thumbnail: string
}

export interface Project {
  id: string
  name: string
  description: string
  cover: string
  assetCount: number
  updatedAt: string
  members: string[]
}

export interface ElementItem {
  id: string
  name: string
  type: ElementType
  thumbnail: string
  description: string
  projectIds: string[]
  updatedAt: string
}

export interface Tutorial {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  progress?: number
  featured?: boolean
  body: string
}

export type SortOption = 'recent' | 'oldest' | 'name'
export type ViewMode = 'grid' | 'list'

export interface Filters {
  assetType: 'all' | 'image' | 'video'
  projectId: string | null
  date: 'all' | 'today' | 'week' | 'month'
}

export interface ComposerControls {
  model: string
  version: string
  aspectRatio: string
  resolution: string
  duration: string
  outputCount: number
  style?: string
  lighting?: string
  negativePrompt?: string
  seed?: string
  motionStrength?: number
  promptAdherence?: number
}

export interface ToastItem {
  id: string
  message: string
  variant: 'success' | 'error' | 'warning' | 'info'
}
