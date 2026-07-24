import { useMemo, useState } from 'react'
import { Search, Check, Plus } from 'lucide-react'
import { useStore } from '@/store/store'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import type { ElementType } from '@/types'

const TYPES: (ElementType | 'All')[] = ['All', 'Character', 'Location', 'Object']

export function ElementPicker({ fromAt }: { fromAt?: boolean }) {
  const { state, dispatch } = useStore()
  const mode = state.mode
  const [query, setQuery] = useState('')
  const [type, setType] = useState<(typeof TYPES)[number]>('All')
  const [selected, setSelected] = useState<string[]>(state.selectedElementIds[mode])

  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })

  const elements = useMemo(
    () =>
      state.elements.filter((e) => {
        if (type !== 'All' && e.type !== type) return false
        if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false
        return true
      }),
    [state.elements, type, query],
  )

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  const confirm = () => {
    dispatch({ type: 'SET_ELEMENTS', mode, ids: selected })
    if (fromAt) {
      // Replace the trailing "@" the user typed and insert tokens for newly added elements.
      const added = selected.filter((id) => !state.selectedElementIds[mode].includes(id))
      const names = added
        .map((id) => state.elements.find((e) => e.id === id)?.name)
        .filter(Boolean) as string[]
      if (names.length) {
        let prompt = state.prompt[mode]
        if (prompt.endsWith('@')) prompt = prompt.slice(0, -1)
        const tokens = names.map((n) => `@${n}`).join(' ')
        prompt = (prompt + (prompt && !prompt.endsWith(' ') ? ' ' : '') + tokens + ' ').replace(/\s+/g, ' ')
        dispatch({ type: 'SET_PROMPT', mode, value: prompt })
      } else {
        // user typed @ but selected nothing new: strip the trailing @
        const prompt = state.prompt[mode]
        if (prompt.endsWith('@')) dispatch({ type: 'SET_PROMPT', mode, value: prompt.slice(0, -1) })
      }
    }
    close()
    setTimeout(() => document.getElementById('composer-prompt')?.focus(), 60)
  }

  return (
    <Modal
      open
      onClose={close}
      title="Add Elements to your prompt"
      description="Select reusable characters, locations or objects."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirm}>
            <Plus size={15} /> Add {selected.length ? `(${selected.length})` : ''}
          </Button>
        </>
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search elements"
            className="w-full rounded-lg border border-border bg-panel2 py-2 pl-9 pr-3 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
          />
        </div>
        <div className="flex gap-1">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 text-[12px] transition-colors',
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

      <div className="grid max-h-[320px] grid-cols-3 gap-2 overflow-y-auto">
        {elements.map((el) => {
          const isSel = selected.includes(el.id)
          return (
            <button
              key={el.id}
              onClick={() => toggle(el.id)}
              className={cn(
                'group relative overflow-hidden rounded-xl border text-left transition-colors',
                isSel ? 'border-accent' : 'border-border hover:border-borderStrong',
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={el.thumbnail} alt="" className="h-full w-full object-cover" />
                {isSel && (
                  <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-accent text-white">
                    <Check size={12} />
                  </span>
                )}
              </div>
              <div className="p-2">
                <div className="truncate text-[12px] font-medium text-textPrimary">{el.name}</div>
                <div className="text-[11px] text-textMuted">{el.type}</div>
              </div>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
