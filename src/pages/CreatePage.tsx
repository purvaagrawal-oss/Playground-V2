import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '@/store/store'
import { AssetGrid } from '@/components/assets/AssetGrid'
import { applyAssetView } from '@/utils/assets'
import { useLoadMore } from '@/hooks/useLoadMore'
import type { Mode } from '@/types'

export function CreatePage() {
  const { state, dispatch } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const { onLoadMore, canLoadMore } = useLoadMore()

  // URL -> state
  useEffect(() => {
    const m = searchParams.get('mode')
    if ((m === 'image' || m === 'video') && m !== state.mode) {
      dispatch({ type: 'SET_MODE', mode: m as Mode })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // state -> URL
  useEffect(() => {
    if (searchParams.get('mode') !== state.mode) {
      setSearchParams({ mode: state.mode }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.mode])

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId)

  const assets = useMemo(
    () =>
      applyAssetView(state.assets, {
        filters: state.filters,
        sort: state.sort,
        favouriteOnly: state.favouriteOnly,
        projectLock: state.activeProjectId,
      }),
    [state.assets, state.filters, state.sort, state.favouriteOnly, state.activeProjectId],
  )

  return (
    <div className="px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-textPrimary">
            {activeProject ? `${activeProject.name} — recent assets` : 'Recent assets'}
          </h2>
          <p className="text-[12px] text-textMuted">
            {assets.length} asset{assets.length === 1 ? '' : 's'} ·{' '}
            {state.mode === 'image' ? 'Image' : 'Video'} mode · new generations save to{' '}
            {activeProject?.name ?? 'no project'}
          </p>
        </div>
      </div>
      <AssetGrid
        assets={assets}
        onLoadMore={onLoadMore}
        canLoadMore={canLoadMore}
        emptyLabel="No assets in this project yet. Describe something below and press Generate."
      />
    </div>
  )
}
