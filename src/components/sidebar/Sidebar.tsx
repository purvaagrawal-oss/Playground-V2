import { useNavigate, useLocation } from 'react-router-dom'
import {
  Image as ImageIcon,
  Video as VideoIcon,
  ChevronRight,
  ChevronDown,
  Search,
  Layers,
  GraduationCap,
  Grid2x2,
  Plus,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { cn } from '@/utils/cn'
import { CreditsCard } from './CreditsCard'
import { UserCard } from './UserCard'
import { Popover, MenuItem } from '@/components/ui/Popover'
import type { Mode } from '@/types'

export function Sidebar() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const collapsed = state.sidebarCollapsed

  const isCreate = location.pathname === '/create'

  const startCreation = (mode: Mode) => {
    dispatch({ type: 'SET_MODE', mode, openRail: true })
    navigate(`/create?mode=${mode}`)
  }

  const toggleRail = (mode: Mode) => {
    if (isCreate && state.mode === mode) {
      dispatch({ type: 'TOGGLE_RAIL' })
    } else {
      startCreation(mode)
    }
  }

  const go = (path: string) => {
    dispatch({ type: 'CLOSE_RAIL' })
    navigate(path)
  }

  const path = location.pathname

  if (collapsed) {
    return (
      <aside className="flex h-full w-[64px] shrink-0 flex-col items-center border-r border-border bg-sidebar py-4">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="mb-6 grid h-9 w-9 place-items-center rounded-lg bg-accent-gradient text-white"
          aria-label="Expand sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <div className="flex flex-col items-center gap-1.5">
          <IconOnly active={isCreate && state.mode === 'image'} onClick={() => startCreation('image')} label="Image">
            <ImageIcon size={18} />
          </IconOnly>
          <IconOnly active={isCreate && state.mode === 'video'} onClick={() => startCreation('video')} label="Video">
            <VideoIcon size={18} />
          </IconOnly>
          <div className="my-2 h-px w-6 bg-border" />
          <IconOnly active={path.startsWith('/assets')} onClick={() => go('/assets')} label="All assets">
            <Grid2x2 size={18} />
          </IconOnly>
          <IconOnly active={path === '/elements'} onClick={() => go('/elements')} label="My elements">
            <Layers size={18} />
          </IconOnly>
          <IconOnly active={path === '/academy'} onClick={() => go('/academy')} label="Academy">
            <GraduationCap size={18} />
          </IconOnly>
          <IconOnly active={path.startsWith('/projects')} onClick={() => go('/projects')} label="Projects">
            <Grid2x2 size={18} />
          </IconOnly>
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Top */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient text-white shadow-[0_2px_10px_rgba(229,0,90,0.4)]">
            <Sparkles size={16} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Playground</span>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="rounded-lg p-1.5 text-textMuted hover:bg-hover hover:text-textPrimary transition-colors"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        {/* Primary creation */}
        <div className="space-y-1">
          <CreationRow
            icon={<ImageIcon size={18} />}
            label="Image"
            active={isCreate && state.mode === 'image'}
            onClick={() => startCreation('image')}
            onChevron={() => toggleRail('image')}
            railOpen={isCreate && state.mode === 'image' && state.useCaseRailOpen}
          />
          <CreationRow
            icon={<VideoIcon size={18} />}
            label="Video"
            active={isCreate && state.mode === 'video'}
            onClick={() => startCreation('video')}
            onChevron={() => toggleRail('video')}
            railOpen={isCreate && state.mode === 'video' && state.useCaseRailOpen}
          />
        </div>

        {/* Search */}
        <button
          onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'search' } })}
          className="mt-3 flex w-full items-center gap-2 rounded-lg border border-border bg-panel px-2.5 py-2 text-left text-[13px] text-textMuted hover:border-borderStrong transition-colors"
        >
          <Search size={15} />
          <span className="flex-1 truncate">Search assets, elements or projects</span>
          <kbd className="rounded border border-border bg-panel2 px-1.5 py-0.5 text-[10px] text-textMuted">
            ⌘K
          </kbd>
        </button>

        {/* Library */}
        <SectionLabel>Library</SectionLabel>
        <div className="space-y-0.5">
          <div>
            <NavRow
              icon={<Grid2x2 size={18} />}
              label="All assets"
              active={path === '/assets'}
              onClick={() => go('/assets')}
              trailing={
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch({ type: 'TOGGLE_ALL_ASSETS' })
                  }}
                  className="rounded p-0.5 text-textMuted hover:text-textPrimary"
                  aria-label="Toggle asset types"
                >
                  {state.allAssetsExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </button>
              }
            />
            {state.allAssetsExpanded && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2">
                <NavRow
                  small
                  icon={<ImageIcon size={16} />}
                  label="Images"
                  active={path === '/assets/images'}
                  onClick={() => go('/assets/images')}
                />
                <NavRow
                  small
                  icon={<VideoIcon size={16} />}
                  label="Videos"
                  active={path === '/assets/videos'}
                  onClick={() => go('/assets/videos')}
                />
              </div>
            )}
          </div>
          <NavRow
            icon={<Layers size={18} />}
            label="My elements"
            active={path === '/elements'}
            onClick={() => go('/elements')}
          />
          <NavRow
            icon={<GraduationCap size={18} />}
            label="Academy"
            active={path === '/academy'}
            onClick={() => go('/academy')}
          />
        </div>

        {/* Projects */}
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-textMuted">
            Projects
          </span>
          <button
            onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'createProject' } })}
            className="rounded p-1 text-textMuted hover:bg-hover hover:text-textPrimary transition-colors"
            aria-label="New project"
          >
            <Plus size={15} />
          </button>
        </div>
        <div className="mt-1 space-y-0.5">
          {state.projects.slice(0, 6).map((p) => (
            <ProjectRow
              key={p.id}
              id={p.id}
              name={p.name}
              cover={p.cover}
              active={state.activeProjectId === p.id}
              onSelect={() => {
                dispatch({ type: 'SET_ACTIVE_PROJECT', projectId: p.id })
              }}
              onOpen={() => go(`/projects/${p.id}`)}
            />
          ))}
          <button
            onClick={() => go('/projects')}
            className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-[12px] text-textMuted hover:text-textPrimary transition-colors"
          >
            View all projects
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="space-y-2 border-t border-border p-3">
        <CreditsCard />
        <UserCard />
      </div>
    </aside>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-textMuted">
      {children}
    </div>
  )
}

function CreationRow({
  icon,
  label,
  active,
  onClick,
  onChevron,
  railOpen,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  onChevron: () => void
  railOpen: boolean
}) {
  return (
    <div
      className={cn(
        'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-120',
        active ? 'bg-accent/15 text-textPrimary' : 'text-textSecondary hover:bg-hover hover:text-textPrimary',
      )}
    >
      <button onClick={onClick} className="flex flex-1 items-center gap-2.5 text-left">
        <span className={cn(active ? 'text-accent' : 'text-current')}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </button>
      <button
        onClick={onChevron}
        aria-label={`Toggle ${label} use cases`}
        className="rounded p-0.5 text-textMuted hover:text-textPrimary"
      >
        <ChevronRight
          size={16}
          className={cn('transition-transform duration-160', railOpen && 'rotate-90')}
        />
      </button>
    </div>
  )
}

function NavRow({
  icon,
  label,
  active,
  onClick,
  trailing,
  small,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  trailing?: React.ReactNode
  small?: boolean
}) {
  return (
    <div
      className={cn(
        'group flex items-center gap-2.5 rounded-lg px-2.5 transition-colors duration-120',
        small ? 'py-1.5' : 'py-2',
        active ? 'bg-accent/15 text-textPrimary' : 'text-textSecondary hover:bg-hover hover:text-textPrimary',
      )}
    >
      <button onClick={onClick} className="flex flex-1 items-center gap-2.5 text-left">
        <span className={cn(active ? 'text-accent' : 'text-current')}>{icon}</span>
        <span className={cn('font-medium', small ? 'text-[13px]' : 'text-sm')}>{label}</span>
      </button>
      {trailing}
    </div>
  )
}

function ProjectRow({
  id,
  name,
  cover,
  active,
  onSelect,
  onOpen,
}: {
  id: string
  name: string
  cover: string
  active: boolean
  onSelect: () => void
  onOpen: () => void
}) {
  const { dispatch } = useStore()
  return (
    <div
      className={cn(
        'group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-120',
        active ? 'bg-accent/15' : 'hover:bg-hover',
      )}
    >
      <button onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <img src={cover} alt="" className="h-6 w-6 shrink-0 rounded-md object-cover" />
        <span className={cn('truncate text-[13px]', active ? 'text-textPrimary' : 'text-textSecondary')}>
          {name}
        </span>
      </button>
      <Popover
        align="left"
        trigger={
          <button
            className="rounded p-0.5 text-textMuted opacity-0 hover:text-textPrimary group-hover:opacity-100"
            aria-label={`${name} menu`}
          >
            <MoreHorizontal size={15} />
          </button>
        }
      >
        {(close) => (
          <>
            <MenuItem onClick={() => { onOpen(); close() }}>Open project</MenuItem>
            <MenuItem onClick={() => { onSelect(); close() }}>Set as active</MenuItem>
            <MenuItem
              onClick={() => {
                dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'createElement', payload: { projectId: id } } })
                close()
              }}
            >
              Add element
            </MenuItem>
          </>
        )}
      </Popover>
    </div>
  )
}

function IconOnly({
  children,
  active,
  onClick,
  label,
}: {
  children: React.ReactNode
  active?: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-lg transition-colors duration-120',
        active ? 'bg-accent/15 text-accent' : 'text-textSecondary hover:bg-hover hover:text-textPrimary',
      )}
    >
      {children}
    </button>
  )
}
