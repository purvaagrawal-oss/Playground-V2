import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, AtSign, MoreHorizontal, Trash2, Pencil } from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { Button } from '@/components/ui/Button'
import { Popover, MenuItem } from '@/components/ui/Popover'
import { timeAgo } from '@/utils/assets'
import { cn } from '@/utils/cn'
import type { ElementType } from '@/types'

const TYPES: (ElementType | 'All')[] = ['All', 'Character', 'Location', 'Object']

export function ElementsPage() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [type, setType] = useState<(typeof TYPES)[number]>('All')

  const elements = useMemo(() => {
    return state.elements.filter((e) => {
      if (type !== 'All' && e.type !== type) return false
      if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [state.elements, type, query])

  const addElementToPrompt = (id: string) => {
    const mode = state.mode
    if (!state.selectedElementIds[mode].includes(id)) {
      dispatch({ type: 'TOGGLE_ELEMENT', mode, id })
    }
    navigate(`/create?mode=${mode}`)
    toast('Element added to prompt', 'success')
    setTimeout(() => document.getElementById('composer-prompt')?.focus(), 80)
  }

  return (
    <div className="px-6 py-5">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-textPrimary">My elements</h2>
          <p className="mt-0.5 text-[13px] text-textSecondary">
            Reusable characters, locations and objects you can drop into any prompt.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'createElement' } })}
        >
          <Plus size={16} />
          Add Element
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search elements"
            className="w-full rounded-lg border border-border bg-panel py-2 pl-9 pr-3 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
          />
        </div>
        <div className="flex gap-1">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-[12px] transition-colors',
                type === t
                  ? 'border-accent/40 bg-accent/15 text-textPrimary'
                  : 'border-border text-textSecondary hover:text-textPrimary',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {elements.map((el) => (
          <div
            key={el.id}
            className="group overflow-hidden rounded-xl border border-border bg-panel2 transition-all hover:border-borderStrong hover:-translate-y-0.5"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={el.thumbnail} alt={el.name} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
              <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                {el.type}
              </span>
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Popover
                  align="right"
                  trigger={
                    <button className="grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white backdrop-blur hover:bg-black/80" aria-label="Element actions">
                      <MoreHorizontal size={15} />
                    </button>
                  }
                >
                  {(close) => (
                    <>
                      <MenuItem icon={<AtSign size={15} />} onClick={() => { addElementToPrompt(el.id); close() }}>
                        Use in prompt
                      </MenuItem>
                      <MenuItem icon={<Pencil size={15} />} onClick={() => { toast('Prototype: element editing is mocked', 'info'); close() }}>
                        Edit
                      </MenuItem>
                      <div className="my-1 h-px bg-border" />
                      <MenuItem icon={<Trash2 size={15} />} danger onClick={() => { dispatch({ type: 'REMOVE_ELEMENT', id: el.id }); toast('Element deleted', 'info'); close() }}>
                        Delete
                      </MenuItem>
                    </>
                  )}
                </Popover>
              </div>
            </div>
            <div className="p-3">
              <div className="truncate text-[13px] font-medium text-textPrimary">{el.name}</div>
              <div className="mt-0.5 truncate text-[11px] text-textMuted">
                {el.type} · updated {timeAgo(el.updatedAt)}
              </div>
              <button
                onClick={() => addElementToPrompt(el.id)}
                className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-panel py-1.5 text-[12px] font-medium text-textSecondary hover:text-textPrimary hover:border-borderStrong transition-colors"
              >
                <AtSign size={13} />
                Use in prompt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
