import { useEffect } from 'react'
import { ChevronRight, FilePlus2, LayoutGrid } from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { useCasesForMode } from '@/data/useCases'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'

export function UseCaseRail() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const mode = state.mode
  const useCases = useCasesForMode(mode)
  const selectedId = state.selectedUseCaseId[mode]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'CLOSE_RAIL' })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dispatch])

  const selectUseCase = (id: string) => {
    const hadPrompt = state.prompt[mode].trim().length > 0
    dispatch({ type: 'SELECT_USE_CASE', useCaseId: id })
    if (hadPrompt) toast('Use-case settings applied', 'info')
    setTimeout(() => {
      document.getElementById('composer-prompt')?.focus()
    }, 60)
  }

  return (
    <aside
      className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-panel animate-slide-in-left"
      aria-label={`${mode} use cases`}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-textMuted">
          {mode === 'image' ? 'Image use cases' : 'Video use cases'}
        </h2>
      </div>

      <button
        onClick={() => {
          dispatch({ type: 'CLOSE_RAIL' })
          setTimeout(() => document.getElementById('composer-prompt')?.focus(), 60)
        }}
        className="mx-3 mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-textSecondary hover:bg-hover hover:text-textPrimary transition-colors"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-panel2 text-textMuted">
          <FilePlus2 size={16} />
        </span>
        <div>
          <div className="text-[13px] font-medium text-textPrimary">Start blank</div>
          <div className="text-[11px] text-textMuted">No preset applied</div>
        </div>
      </button>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        <div className="space-y-1">
          {useCases.map((uc) => (
            <button
              key={uc.id}
              onClick={() => selectUseCase(uc.id)}
              className={cn(
                'group flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors duration-120',
                selectedId === uc.id
                  ? 'border-accent/40 bg-accent/10'
                  : 'border-transparent hover:border-border hover:bg-hover',
              )}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                style={{ backgroundColor: `${uc.iconColor}22`, color: uc.iconColor }}
              >
                <Icon name={uc.icon} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-textPrimary">{uc.title}</div>
                <div className="truncate text-[11px] text-textMuted">{uc.description}</div>
              </div>
              <ChevronRight size={15} className="shrink-0 text-textMuted group-hover:text-textPrimary" />
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-3">
        <button
          onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'viewAllUseCases' } })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-panel2 py-2 text-[13px] font-medium text-textSecondary hover:text-textPrimary transition-colors"
        >
          <LayoutGrid size={15} />
          {mode === 'image' ? 'View all image use cases' : 'View all video use cases'}
        </button>
      </div>
    </aside>
  )
}
