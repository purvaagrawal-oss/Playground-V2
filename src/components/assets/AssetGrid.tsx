import { ImageOff } from 'lucide-react'
import { useStore } from '@/store/store'
import { AssetCard } from './AssetCard'
import { AssetListRow } from './AssetListRow'
import { Button } from '@/components/ui/Button'
import type { Asset } from '@/types'

interface AssetGridProps {
  assets: Asset[]
  onLoadMore?: () => void
  canLoadMore?: boolean
  emptyLabel?: string
}

export function AssetGrid({ assets, onLoadMore, canLoadMore, emptyLabel }: AssetGridProps) {
  const { state } = useStore()

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-panel/40 py-16 text-center">
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-panel2 text-textMuted">
          <ImageOff size={22} />
        </div>
        <p className="text-sm font-medium text-textPrimary">Nothing here yet</p>
        <p className="mt-1 max-w-xs text-[13px] text-textMuted">
          {emptyLabel ?? 'Try a different filter, or generate something new from the composer below.'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {state.viewMode === 'grid' ? (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
          {assets.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((a) => (
            <AssetListRow key={a.id} asset={a} />
          ))}
        </div>
      )}

      {onLoadMore && canLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={onLoadMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  )
}
