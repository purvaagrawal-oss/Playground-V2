import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useStore } from '@/store/store'
import { Button } from '@/components/ui/Button'
import { timeAgo } from '@/utils/assets'

export function ProjectsPage() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const projects = useMemo(() => {
    let list = [...state.projects]
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else
      list.sort((a, b) => {
        const at = new Date(a.updatedAt).getTime()
        const bt = new Date(b.updatedAt).getTime()
        return state.sort === 'oldest' ? at - bt : bt - at
      })
    return list
  }, [state.projects, query, state.sort])

  return (
    <div className="px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-textPrimary">Projects</h2>
          <p className="mt-0.5 text-[13px] text-textSecondary">
            Organize creative production by show and campaign.
          </p>
        </div>
        <Button variant="primary" onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'createProject' } })}>
          <Plus size={16} />
          New Project
        </Button>
      </div>

      <div className="mt-4 max-w-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="w-full rounded-lg border border-border bg-panel py-2 pl-9 pr-3 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {projects.map((p) => {
          const count = state.assets.filter((a) => a.projectId === p.id).length
          return (
            <button
              key={p.id}
              onClick={() => {
                dispatch({ type: 'SET_ACTIVE_PROJECT', projectId: p.id })
                navigate(`/projects/${p.id}`)
              }}
              className="group overflow-hidden rounded-2xl border border-border bg-panel2 text-left transition-all hover:border-borderStrong hover:-translate-y-0.5 hover:shadow-panel"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-[15px] font-semibold text-textPrimary">{p.name}</h3>
                  <div className="flex -space-x-2">
                    {p.members.slice(0, 3).map((m, i) => (
                      <img key={i} src={m} alt="" className="h-6 w-6 rounded-full border-2 border-panel2" />
                    ))}
                  </div>
                </div>
                <p className="mt-1 line-clamp-1 text-[12px] text-textMuted">{p.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-textMuted">
                  <span>{count} assets</span>·<span>updated {timeAgo(p.updatedAt)}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
