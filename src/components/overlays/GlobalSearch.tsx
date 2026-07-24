import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Image as ImageIcon, Play, Layers, FolderOpen } from 'lucide-react'
import { useStore } from '@/store/store'
import { useAssetActions } from '@/hooks/useAssetActions'
import { Portal } from '@/components/ui/Portal'
import { useFocusTrap } from '@/components/ui/useFocusTrap'

export function GlobalSearch() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const actions = useAssetActions()
  const [query, setQuery] = useState('')
  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })
  const ref = useFocusTrap<HTMLDivElement>(true, close)

  const q = query.trim().toLowerCase()

  const assets = useMemo(
    () => (q ? state.assets.filter((a) => a.status === 'ready' && (a.title.toLowerCase().includes(q) || a.prompt.toLowerCase().includes(q))).slice(0, 5) : []),
    [state.assets, q],
  )
  const elements = useMemo(
    () => (q ? state.elements.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 5) : []),
    [state.elements, q],
  )
  const projects = useMemo(
    () => (q ? state.projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5) : []),
    [state.projects, q],
  )

  const empty = q && assets.length === 0 && elements.length === 0 && projects.length === 0

  return (
    <Portal>
      <div className="fixed inset-0 z-[95] flex items-start justify-center px-6 pt-[12vh]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in" onClick={close} />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-panel shadow-pop animate-scale-in"
        >
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <Search size={18} className="text-textMuted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets, elements or projects"
              className="flex-1 bg-transparent text-[14px] text-textPrimary placeholder:text-textMuted outline-none"
            />
            <kbd className="rounded border border-border bg-panel2 px-1.5 py-0.5 text-[10px] text-textMuted">Esc</kbd>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-2">
            {!q && (
              <p className="px-3 py-6 text-center text-[13px] text-textMuted">
                Start typing to search across assets, elements and projects.
              </p>
            )}
            {empty && (
              <p className="px-3 py-6 text-center text-[13px] text-textMuted">No results for “{query}”.</p>
            )}

            {assets.length > 0 && (
              <Group label="Assets">
                {assets.map((a) => (
                  <ResultRow
                    key={a.id}
                    thumb={a.thumbnail}
                    icon={a.type === 'video' ? <Play size={12} /> : <ImageIcon size={12} />}
                    title={a.title}
                    sub={`${a.type} · ${state.projects.find((p) => p.id === a.projectId)?.name ?? 'No project'}`}
                    onClick={() => {
                      close()
                      actions.openDetail(a)
                    }}
                  />
                ))}
              </Group>
            )}

            {elements.length > 0 && (
              <Group label="Elements">
                {elements.map((e) => (
                  <ResultRow
                    key={e.id}
                    thumb={e.thumbnail}
                    icon={<Layers size={12} />}
                    title={e.name}
                    sub={e.type}
                    onClick={() => {
                      close()
                      navigate('/elements')
                    }}
                  />
                ))}
              </Group>
            )}

            {projects.length > 0 && (
              <Group label="Projects">
                {projects.map((p) => (
                  <ResultRow
                    key={p.id}
                    thumb={p.cover}
                    icon={<FolderOpen size={12} />}
                    title={p.name}
                    sub={`${state.assets.filter((a) => a.projectId === p.id).length} assets`}
                    onClick={() => {
                      close()
                      dispatch({ type: 'SET_ACTIVE_PROJECT', projectId: p.id })
                      navigate(`/projects/${p.id}`)
                    }}
                  />
                ))}
              </Group>
            )}
          </div>
        </div>
      </div>
    </Portal>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-textMuted">{label}</div>
      {children}
    </div>
  )
}

function ResultRow({
  thumb,
  icon,
  title,
  sub,
  onClick,
}: {
  thumb: string
  icon: React.ReactNode
  title: string
  sub: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-hover transition-colors"
    >
      <img src={thumb} alt="" className="h-9 w-9 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-textPrimary">{title}</div>
        <div className="flex items-center gap-1 text-[11px] text-textMuted">
          {icon}
          <span className="capitalize">{sub}</span>
        </div>
      </div>
    </button>
  )
}
