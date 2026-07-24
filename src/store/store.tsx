/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import type {
  Asset,
  ComposerControls,
  ElementItem,
  Filters,
  Mode,
  Project,
  Reference,
  SortOption,
  ToastItem,
  ViewMode,
} from '@/types'
import { SEED_ASSETS } from '@/data/assets'
import { SEED_PROJECTS } from '@/data/projects'
import { SEED_ELEMENTS } from '@/data/elements'
import { getUseCase } from '@/data/useCases'
import { makeThumb } from '@/utils/thumbnails'
import { clearPersisted, loadPersisted, savePersisted } from './persistence'

export const IMAGE_COST_PER_OUTPUT = 0.125
export const VIDEO_COST_PER_OUTPUT = 2.5

export type OverlayType =
  | 'viewAllUseCases'
  | 'assetDetail'
  | 'preview'
  | 'referencePicker'
  | 'elementPicker'
  | 'createElement'
  | 'editAsset'
  | 'createProject'
  | 'filters'
  | 'search'

export interface Overlay {
  type: OverlayType
  payload?: any
}

const DEFAULT_IMAGE_CONTROLS: ComposerControls = {
  model: 'Soul Cinema',
  version: 'v1.2',
  aspectRatio: '16:9',
  resolution: '2K',
  duration: '5s',
  outputCount: 1,
  style: 'Cinematic',
}

const DEFAULT_VIDEO_CONTROLS: ComposerControls = {
  model: 'Motion Studio',
  version: 'v1.2',
  aspectRatio: '16:9',
  resolution: '1080p',
  duration: '5s',
  outputCount: 1,
  motionStrength: 50,
  promptAdherence: 60,
}

export interface AppState {
  mode: Mode
  useCaseRailOpen: boolean
  selectedUseCaseId: { image?: string; video?: string }
  prompt: { image: string; video: string }
  controls: { image: ComposerControls; video: ComposerControls }
  references: { image: Reference[]; video: Reference[] }
  selectedElementIds: { image: string[]; video: string[] }
  activeProjectId: string | null
  assets: Asset[]
  projects: Project[]
  elements: ElementItem[]
  filters: Filters
  sort: SortOption
  viewMode: ViewMode
  favouriteOnly: boolean
  credits: number
  toasts: ToastItem[]
  sidebarCollapsed: boolean
  allAssetsExpanded: boolean
  overlay: Overlay | null
}

const initialState: AppState = {
  mode: 'image',
  useCaseRailOpen: false,
  selectedUseCaseId: {},
  prompt: { image: '', video: '' },
  controls: { image: { ...DEFAULT_IMAGE_CONTROLS }, video: { ...DEFAULT_VIDEO_CONTROLS } },
  references: { image: [], video: [] },
  selectedElementIds: { image: [], video: [] },
  activeProjectId: 'p-beauty-in-black',
  assets: SEED_ASSETS,
  projects: SEED_PROJECTS,
  elements: SEED_ELEMENTS,
  filters: { assetType: 'all', projectId: null, date: 'all' },
  sort: 'recent',
  viewMode: 'grid',
  favouriteOnly: false,
  credits: 1245,
  toasts: [],
  sidebarCollapsed: false,
  allAssetsExpanded: true,
  overlay: null,
}

type Action =
  | { type: 'SET_MODE'; mode: Mode; openRail?: boolean }
  | { type: 'TOGGLE_RAIL'; open?: boolean }
  | { type: 'CLOSE_RAIL' }
  | { type: 'SELECT_USE_CASE'; useCaseId: string }
  | { type: 'CLEAR_USE_CASE'; mode: Mode }
  | { type: 'SET_PROMPT'; mode: Mode; value: string }
  | { type: 'SET_CONTROL'; mode: Mode; patch: Partial<ComposerControls> }
  | { type: 'ADD_REFERENCE'; mode: Mode; reference: Reference }
  | { type: 'REMOVE_REFERENCE'; mode: Mode; id: string }
  | { type: 'SET_ELEMENTS'; mode: Mode; ids: string[] }
  | { type: 'TOGGLE_ELEMENT'; mode: Mode; id: string }
  | { type: 'SET_ACTIVE_PROJECT'; projectId: string | null }
  | { type: 'ADD_ASSET'; asset: Asset }
  | { type: 'UPDATE_ASSET'; id: string; patch: Partial<Asset> }
  | { type: 'REMOVE_ASSET'; id: string }
  | { type: 'ADD_ASSETS'; assets: Asset[] }
  | { type: 'TOGGLE_FAVOURITE'; id: string }
  | { type: 'ADD_PROJECT'; project: Project }
  | { type: 'UPDATE_PROJECT'; id: string; patch: Partial<Project> }
  | { type: 'ADD_ELEMENT'; element: ElementItem }
  | { type: 'UPDATE_ELEMENT'; id: string; patch: Partial<ElementItem> }
  | { type: 'REMOVE_ELEMENT'; id: string }
  | { type: 'SET_FILTERS'; patch: Partial<Filters> }
  | { type: 'SET_SORT'; sort: SortOption }
  | { type: 'SET_VIEW'; view: ViewMode }
  | { type: 'TOGGLE_FAVOURITE_ONLY' }
  | { type: 'SET_CREDITS'; credits: number }
  | { type: 'PUSH_TOAST'; toast: ToastItem }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'TOGGLE_SIDEBAR'; collapsed?: boolean }
  | { type: 'TOGGLE_ALL_ASSETS'; open?: boolean }
  | { type: 'OPEN_OVERLAY'; overlay: Overlay }
  | { type: 'CLOSE_OVERLAY' }
  | { type: 'APPLY_RECREATE'; asset: Asset }
  | { type: 'RESET' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        useCaseRailOpen: action.openRail ?? state.useCaseRailOpen,
      }
    case 'TOGGLE_RAIL':
      return { ...state, useCaseRailOpen: action.open ?? !state.useCaseRailOpen }
    case 'CLOSE_RAIL':
      return { ...state, useCaseRailOpen: false }
    case 'SELECT_USE_CASE': {
      const uc = getUseCase(action.useCaseId)
      if (!uc) return state
      const mode = uc.mode
      const currentPrompt = state.prompt[mode]
      const nextControls: ComposerControls = {
        ...state.controls[mode],
        model: uc.defaults.model,
        version: uc.defaults.version,
        aspectRatio: uc.defaults.aspectRatio,
        resolution: uc.defaults.resolution,
        style: uc.defaults.style ?? state.controls[mode].style,
        outputCount: uc.defaults.outputCount ?? state.controls[mode].outputCount,
        duration: uc.defaults.duration ?? state.controls[mode].duration,
      }
      return {
        ...state,
        mode,
        useCaseRailOpen: false,
        selectedUseCaseId: { ...state.selectedUseCaseId, [mode]: action.useCaseId },
        controls: { ...state.controls, [mode]: nextControls },
        prompt: { ...state.prompt, [mode]: currentPrompt },
      }
    }
    case 'CLEAR_USE_CASE':
      return {
        ...state,
        selectedUseCaseId: { ...state.selectedUseCaseId, [action.mode]: undefined },
      }
    case 'SET_PROMPT':
      return { ...state, prompt: { ...state.prompt, [action.mode]: action.value } }
    case 'SET_CONTROL':
      return {
        ...state,
        controls: {
          ...state.controls,
          [action.mode]: { ...state.controls[action.mode], ...action.patch },
        },
      }
    case 'ADD_REFERENCE':
      return {
        ...state,
        references: {
          ...state.references,
          [action.mode]: [
            // start/end frames are singular per role
            ...state.references[action.mode].filter(
              (r) => r.role === 'reference' || r.role !== action.reference.role,
            ),
            action.reference,
          ],
        },
      }
    case 'REMOVE_REFERENCE':
      return {
        ...state,
        references: {
          ...state.references,
          [action.mode]: state.references[action.mode].filter((r) => r.id !== action.id),
        },
      }
    case 'SET_ELEMENTS':
      return {
        ...state,
        selectedElementIds: { ...state.selectedElementIds, [action.mode]: action.ids },
      }
    case 'TOGGLE_ELEMENT': {
      const cur = state.selectedElementIds[action.mode]
      const next = cur.includes(action.id)
        ? cur.filter((i) => i !== action.id)
        : [...cur, action.id]
      return {
        ...state,
        selectedElementIds: { ...state.selectedElementIds, [action.mode]: next },
      }
    }
    case 'SET_ACTIVE_PROJECT':
      return { ...state, activeProjectId: action.projectId }
    case 'ADD_ASSET':
      return { ...state, assets: [action.asset, ...state.assets] }
    case 'ADD_ASSETS':
      return { ...state, assets: [...state.assets, ...action.assets] }
    case 'UPDATE_ASSET':
      return {
        ...state,
        assets: state.assets.map((a) => (a.id === action.id ? { ...a, ...action.patch } : a)),
      }
    case 'REMOVE_ASSET':
      return { ...state, assets: state.assets.filter((a) => a.id !== action.id) }
    case 'TOGGLE_FAVOURITE':
      return {
        ...state,
        assets: state.assets.map((a) =>
          a.id === action.id ? { ...a, favourite: !a.favourite } : a,
        ),
      }
    case 'ADD_PROJECT':
      return { ...state, projects: [action.project, ...state.projects] }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      }
    case 'ADD_ELEMENT':
      return { ...state, elements: [action.element, ...state.elements] }
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map((e) => (e.id === action.id ? { ...e, ...action.patch } : e)),
      }
    case 'REMOVE_ELEMENT':
      return { ...state, elements: state.elements.filter((e) => e.id !== action.id) }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.patch } }
    case 'SET_SORT':
      return { ...state, sort: action.sort }
    case 'SET_VIEW':
      return { ...state, viewMode: action.view }
    case 'TOGGLE_FAVOURITE_ONLY':
      return { ...state, favouriteOnly: !state.favouriteOnly }
    case 'SET_CREDITS':
      return { ...state, credits: Math.max(0, action.credits) }
    case 'PUSH_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] }
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: action.collapsed ?? !state.sidebarCollapsed }
    case 'TOGGLE_ALL_ASSETS':
      return { ...state, allAssetsExpanded: action.open ?? !state.allAssetsExpanded }
    case 'OPEN_OVERLAY':
      return { ...state, overlay: action.overlay }
    case 'CLOSE_OVERLAY':
      return { ...state, overlay: null }
    case 'APPLY_RECREATE': {
      const a = action.asset
      const mode = a.type
      return {
        ...state,
        mode,
        selectedUseCaseId: { ...state.selectedUseCaseId, [mode]: a.useCaseId },
        prompt: { ...state.prompt, [mode]: a.prompt },
        controls: {
          ...state.controls,
          [mode]: {
            ...state.controls[mode],
            model: a.model,
            version: a.version,
            aspectRatio: a.aspectRatio,
            resolution: a.resolution,
            duration: a.duration ?? state.controls[mode].duration,
            outputCount: a.outputCount,
          },
        },
        references: { ...state.references, [mode]: a.references },
        selectedElementIds: { ...state.selectedElementIds, [mode]: a.elementIds },
        activeProjectId: a.projectId ?? state.activeProjectId,
        overlay: null,
      }
    }
    case 'RESET':
      return { ...initialState, assets: SEED_ASSETS, projects: SEED_PROJECTS, elements: SEED_ELEMENTS }
    default:
      return state
  }
}

const PERSIST_KEYS: (keyof AppState)[] = [
  'assets',
  'projects',
  'elements',
  'credits',
  'prompt',
  'selectedUseCaseId',
  'activeProjectId',
  'controls',
  'sidebarCollapsed',
  'viewMode',
]

function hydrate(base: AppState): AppState {
  const persisted = loadPersisted<AppState>()
  if (!persisted) return base
  const merged: AppState = { ...base }
  for (const key of PERSIST_KEYS) {
    if (persisted[key] !== undefined) {
      // @ts-expect-error dynamic assignment across known keys
      merged[key] = persisted[key]
    }
  }
  return merged
}

interface StoreContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, hydrate)

  useEffect(() => {
    const toPersist: Record<string, unknown> = {}
    for (const key of PERSIST_KEYS) toPersist[key] = state[key]
    savePersisted(toPersist)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

// ---- Convenience hooks ----

let toastCounter = 0
export function useToast() {
  const { dispatch } = useStore()
  return (message: string, variant: ToastItem['variant'] = 'info') => {
    const id = `toast-${Date.now()}-${toastCounter++}`
    dispatch({ type: 'PUSH_TOAST', toast: { id, message, variant } })
    setTimeout(() => dispatch({ type: 'DISMISS_TOAST', id }), 3200)
  }
}

export function costForMode(mode: Mode, outputCount: number): number {
  const per = mode === 'image' ? IMAGE_COST_PER_OUTPUT : VIDEO_COST_PER_OUTPUT
  return +(per * Math.max(1, outputCount)).toFixed(3)
}

// Generation with cancellable timers.
const genTimers = new Map<string, { progress: ReturnType<typeof setInterval>; done: ReturnType<typeof setTimeout> }>()

export function useGeneration() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const stateRef = useRef(state)
  stateRef.current = state

  const generate = () => {
    const s = stateRef.current
    const mode = s.mode
    const prompt = s.prompt[mode].trim()
    const refs = s.references[mode]
    if (!prompt && refs.length === 0) {
      toast('Add a prompt or a reference to generate', 'error')
      return false
    }
    const controls = s.controls[mode]
    const cost = costForMode(mode, controls.outputCount)
    dispatch({ type: 'SET_CREDITS', credits: s.credits - cost })

    const id = `gen-${Date.now()}`
    const uc = getUseCase(s.selectedUseCaseId[mode])
    const genAsset: Asset = {
      id,
      title: prompt ? prompt.slice(0, 42) : 'Generated asset',
      type: mode,
      thumbnail: makeThumb(id, 'cinematic', 'Generating…'),
      duration: mode === 'video' ? controls.duration : undefined,
      prompt,
      useCaseId: s.selectedUseCaseId[mode],
      useCaseTitle: uc?.title,
      model: controls.model,
      version: controls.version,
      aspectRatio: controls.aspectRatio,
      resolution: controls.resolution,
      outputCount: controls.outputCount,
      projectId: s.activeProjectId,
      creator: 'Aanya',
      createdAt: new Date().toISOString(),
      references: refs,
      elementIds: s.selectedElementIds[mode],
      favourite: false,
      status: 'generating',
      progress: 0,
    }
    dispatch({ type: 'ADD_ASSET', asset: genAsset })

    let progress = 0
    const progressTimer = setInterval(() => {
      progress = Math.min(95, progress + Math.random() * 18 + 6)
      dispatch({ type: 'UPDATE_ASSET', id, patch: { progress } })
    }, 350)

    const doneTimer = setTimeout(() => {
      clearInterval(progressTimer)
      genTimers.delete(id)
      const palette = ['cinematic', 'character', 'promo', 'location', 'fantasy', 'urban'][
        Math.floor(Math.random() * 6)
      ] as any
      dispatch({
        type: 'UPDATE_ASSET',
        id,
        patch: {
          status: 'ready',
          progress: 100,
          thumbnail: makeThumb(id + '-done', palette, genAsset.title),
        },
      })
      toast('Generation complete', 'success')
    }, 3000)

    genTimers.set(id, { progress: progressTimer, done: doneTimer })
    return true
  }

  const cancel = (id: string) => {
    const timers = genTimers.get(id)
    if (timers) {
      clearInterval(timers.progress)
      clearTimeout(timers.done)
      genTimers.delete(id)
    }
    const asset = stateRef.current.assets.find((a) => a.id === id)
    if (asset) {
      const cost = costForMode(asset.type, asset.outputCount)
      dispatch({ type: 'SET_CREDITS', credits: stateRef.current.credits + cost })
    }
    dispatch({ type: 'REMOVE_ASSET', id })
    toast('Generation cancelled — credits restored', 'warning')
  }

  return { generate, cancel }
}

export function resetPrototype() {
  clearPersisted()
  window.location.reload()
}

export { initialState, DEFAULT_IMAGE_CONTROLS, DEFAULT_VIDEO_CONTROLS }
