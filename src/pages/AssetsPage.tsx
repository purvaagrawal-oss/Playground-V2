import { useMemo } from 'react'
import { useStore } from '@/store/store'
import { AssetGrid } from '@/components/assets/AssetGrid'
import { applyAssetView } from '@/utils/assets'
import { useLoadMore } from '@/hooks/useLoadMore'

export function AssetsPage({ filter }: { filter: 'all' | 'image' | 'video' }) {
  const { state } = useStore()
  const { onLoadMore, canLoadMore } = useLoadMore()

  const assets = useMemo(
    () =>
      applyAssetView(state.assets, {
        filters: state.filters,
        sort: state.sort,
        favouriteOnly: state.favouriteOnly,
        typeLock: filter === 'all' ? undefined : filter,
      }),
    [state.assets, state.filters, state.sort, state.favouriteOnly, filter],
  )

  const heading = filter === 'all' ? 'All assets' : filter === 'image' ? 'Images' : 'Videos'

  return (
    <div className="px-5 py-4">
      <p className="mb-3 text-[12px] text-textMuted">
        {heading} · {assets.length} result{assets.length === 1 ? '' : 's'}
        {state.favouriteOnly ? ' · favourites only' : ''}
      </p>
      <AssetGrid assets={assets} onLoadMore={onLoadMore} canLoadMore={canLoadMore} />
    </div>
  )
}
