import {
  SlidersHorizontal,
  Star,
  ArrowUpDown,
  LayoutGrid,
  List,
  Bell,
  ChevronDown,
  Check,
  FolderOpen,
} from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { Popover, MenuItem } from '@/components/ui/Popover'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/utils/cn'
import { avatarUri } from '@/utils/thumbnails'
import type { SortOption } from '@/types'

const SORT_LABELS: Record<SortOption, string> = {
  recent: 'Recent',
  oldest: 'Oldest',
  name: 'Name',
}

export function Header({ title, showProjectSelector }: { title: string; showProjectSelector: boolean }) {
  const { state, dispatch } = useStore()
  const toast = useToast()

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId)

  return (
    <header className="flex h-[70px] shrink-0 items-center justify-between gap-4 border-b border-border bg-app px-5">
      <div className="flex min-w-0 items-center gap-4">
        <h1 className="truncate text-lg font-semibold text-textPrimary">{title}</h1>

        {showProjectSelector && (
          <Popover
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5 text-left hover:border-borderStrong transition-colors">
                <FolderOpen size={15} className="text-textMuted" />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-wide text-textMuted">Project</div>
                  <div className="text-[13px] font-medium text-textPrimary">
                    {activeProject?.name ?? 'No project'}
                  </div>
                </div>
                <ChevronDown size={14} className="text-textMuted" />
              </button>
            }
            panelClassName="w-[220px]"
          >
            {(close) => (
              <>
                <MenuItem
                  selected={state.activeProjectId === null}
                  onClick={() => {
                    dispatch({ type: 'SET_ACTIVE_PROJECT', projectId: null })
                    close()
                  }}
                  icon={state.activeProjectId === null ? <Check size={14} /> : <span className="w-3.5" />}
                >
                  No project
                </MenuItem>
                {state.projects.map((p) => (
                  <MenuItem
                    key={p.id}
                    selected={state.activeProjectId === p.id}
                    onClick={() => {
                      dispatch({ type: 'SET_ACTIVE_PROJECT', projectId: p.id })
                      close()
                    }}
                    icon={
                      state.activeProjectId === p.id ? <Check size={14} /> : <span className="w-3.5" />
                    }
                  >
                    {p.name}
                  </MenuItem>
                ))}
              </>
            )}
          </Popover>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Popover
          align="right"
          trigger={
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-panel px-2.5 py-1.5 text-[13px] text-textSecondary hover:text-textPrimary transition-colors">
              <SlidersHorizontal size={15} />
              Filter
            </button>
          }
          panelClassName="w-[240px]"
        >
          <FilterPanel />
        </Popover>

        <Tooltip label={state.favouriteOnly ? 'Showing favourites' : 'Show favourites only'}>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_FAVOURITE_ONLY' })}
            aria-pressed={state.favouriteOnly}
            className={cn(
              'grid h-8 w-8 place-items-center rounded-lg border transition-colors',
              state.favouriteOnly
                ? 'border-accent/40 bg-accent/15 text-accent'
                : 'border-border bg-panel text-textSecondary hover:text-textPrimary',
            )}
          >
            <Star size={15} className={state.favouriteOnly ? 'fill-accent' : ''} />
          </button>
        </Tooltip>

        <Popover
          align="right"
          trigger={
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-panel px-2.5 py-1.5 text-[13px] text-textSecondary hover:text-textPrimary transition-colors">
              <ArrowUpDown size={15} />
              {SORT_LABELS[state.sort]}
            </button>
          }
        >
          {(close) => (
            <>
              {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
                <MenuItem
                  key={s}
                  selected={state.sort === s}
                  onClick={() => {
                    dispatch({ type: 'SET_SORT', sort: s })
                    close()
                  }}
                  icon={state.sort === s ? <Check size={14} /> : <span className="w-3.5" />}
                >
                  {SORT_LABELS[s]}
                </MenuItem>
              ))}
            </>
          )}
        </Popover>

        <div className="flex overflow-hidden rounded-lg border border-border">
          <Tooltip label="Grid view">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'grid' })}
              className={cn(
                'grid h-8 w-8 place-items-center transition-colors',
                state.viewMode === 'grid' ? 'bg-hover text-textPrimary' : 'bg-panel text-textMuted hover:text-textPrimary',
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
          </Tooltip>
          <Tooltip label="List view">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'list' })}
              className={cn(
                'grid h-8 w-8 place-items-center transition-colors',
                state.viewMode === 'list' ? 'bg-hover text-textPrimary' : 'bg-panel text-textMuted hover:text-textPrimary',
              )}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </Tooltip>
        </div>

        <Tooltip label="Notifications">
          <button
            onClick={() => toast('Prototype: no new notifications', 'info')}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-panel text-textSecondary hover:text-textPrimary transition-colors"
            aria-label="Notifications"
          >
            <Bell size={15} />
          </button>
        </Tooltip>

        <img src={avatarUri('Aanya')} alt="Aanya" className="ml-1 h-8 w-8 rounded-full" />
      </div>
    </header>
  )
}

function FilterPanel() {
  const { state, dispatch } = useStore()
  return (
    <div className="space-y-3 p-2">
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-textMuted">
          Asset type
        </div>
        <div className="flex gap-1">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => dispatch({ type: 'SET_FILTERS', patch: { assetType: t } })}
              className={cn(
                'flex-1 rounded-lg border px-2 py-1 text-[12px] capitalize transition-colors',
                state.filters.assetType === t
                  ? 'border-accent/40 bg-accent/15 text-textPrimary'
                  : 'border-border text-textSecondary hover:text-textPrimary',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-textMuted">
          Date
        </div>
        <div className="grid grid-cols-2 gap-1">
          {(['all', 'today', 'week', 'month'] as const).map((d) => (
            <button
              key={d}
              onClick={() => dispatch({ type: 'SET_FILTERS', patch: { date: d } })}
              className={cn(
                'rounded-lg border px-2 py-1 text-[12px] capitalize transition-colors',
                state.filters.date === d
                  ? 'border-accent/40 bg-accent/15 text-textPrimary'
                  : 'border-border text-textSecondary hover:text-textPrimary',
              )}
            >
              {d === 'all' ? 'All time' : `Past ${d}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
