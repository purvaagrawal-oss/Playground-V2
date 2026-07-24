import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AtSign, Plus } from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { AssetGrid } from '@/components/assets/AssetGrid'
import { Button } from '@/components/ui/Button'
import { applyAssetView, timeAgo } from '@/utils/assets'
import { cn } from '@/utils/cn'

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState<'assets' | 'elements'>('assets')
  const [assetTab, setAssetTab] = useState<'all' | 'image' | 'video'>('all')

  const project = state.projects.find((p) => p.id === projectId)

  useEffect(() => {
    if (projectId && state.activeProjectId !== projectId) {
      dispatch({ type: 'SET_ACTIVE_PROJECT', projectId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const assets = useMemo(
    () =>
      applyAssetView(state.assets, {
        filters: state.filters,
        sort: state.sort,
        favouriteOnly: state.favouriteOnly,
        typeLock: assetTab === 'all' ? undefined : assetTab,
        projectLock: projectId ?? null,
      }),
    [state.assets, state.filters, state.sort, state.favouriteOnly, assetTab, projectId],
  )

  const elements = state.elements.filter((e) => e.projectIds.includes(projectId ?? ''))
  const totalCount = state.assets.filter((a) => a.projectId === projectId).length

  if (!project) {
    return (
      <div className="px-6 py-10 text-center text-textMuted">
        Project not found.{' '}
        <button className="text-accent hover:underline" onClick={() => navigate('/projects')}>
          Back to projects
        </button>
      </div>
    )
  }

  const addElementToPrompt = (id: string) => {
    const mode = state.mode
    if (!state.selectedElementIds[mode].includes(id)) dispatch({ type: 'TOGGLE_ELEMENT', mode, id })
    navigate(`/create?mode=${mode}`)
    toast('Element added to prompt', 'success')
    setTimeout(() => document.getElementById('composer-prompt')?.focus(), 80)
  }

  return (
    <div className="px-5 py-4">
      <div className="mb-3">
        <p className="max-w-2xl text-[13px] text-textSecondary">{project.description}</p>
        <p className="mt-1 text-[12px] text-textMuted">
          {totalCount} assets · updated {timeAgo(project.updatedAt)}
        </p>
      </div>

      {/* tabs */}
      <div className="mb-4 flex items-center gap-1 border-b border-border">
        {(['assets', 'elements'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'relative px-3 py-2 text-[13px] font-medium capitalize transition-colors',
              tab === t ? 'text-textPrimary' : 'text-textMuted hover:text-textSecondary',
            )}
          >
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>

      {tab === 'assets' ? (
        <>
          <div className="mb-3 flex gap-1">
            {(['all', 'image', 'video'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setAssetTab(t)}
                className={cn(
                  'rounded-lg border px-3 py-1 text-[12px] capitalize transition-colors',
                  assetTab === t
                    ? 'border-accent/40 bg-accent/15 text-textPrimary'
                    : 'border-border text-textSecondary hover:text-textPrimary',
                )}
              >
                {t === 'all' ? 'All' : `${t}s`}
              </button>
            ))}
          </div>
          <AssetGrid assets={assets} emptyLabel="No assets in this project yet. Generate one from the composer below." />
        </>
      ) : (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => toast('Prototype: pick from existing elements', 'info')}>
              <Plus size={14} /> Add existing Element
            </Button>
            <Button variant="primary" size="sm" onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'createElement', payload: { projectId } } })}>
              <Plus size={14} /> Create new Element
            </Button>
          </div>
          {elements.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-panel/40 p-8 text-center text-[13px] text-textMuted">
              No elements linked to this project yet.
            </p>
          ) : (
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
              {elements.map((el) => (
                <div key={el.id} className="overflow-hidden rounded-xl border border-border bg-panel2">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={el.thumbnail} alt="" className="h-full w-full object-cover" />
                    <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {el.type}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="truncate text-[13px] font-medium text-textPrimary">{el.name}</div>
                    <button
                      onClick={() => addElementToPrompt(el.id)}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-panel py-1.5 text-[12px] font-medium text-textSecondary hover:text-textPrimary hover:border-borderStrong transition-colors"
                    >
                      <AtSign size={13} /> Use in prompt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
