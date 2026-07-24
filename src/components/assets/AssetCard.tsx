import { MoreHorizontal, RefreshCw, ImageDown, Download, Star, Play, X } from 'lucide-react'
import { useStore, useGeneration } from '@/store/store'
import { useAssetActions } from '@/hooks/useAssetActions'
import { Popover } from '@/components/ui/Popover'
import { Tooltip } from '@/components/ui/Tooltip'
import { AssetMenu } from './AssetMenu'
import { cn } from '@/utils/cn'
import type { Asset } from '@/types'

export function AssetCard({ asset }: { asset: Asset }) {
  const { dispatch } = useStore()
  const actions = useAssetActions()
  const { cancel } = useGeneration()
  const generating = asset.status === 'generating'

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-panel2 transition-all duration-160 hover:border-borderStrong hover:-translate-y-0.5 hover:shadow-panel">
      <button
        onClick={() => !generating && actions.openDetail(asset)}
        className="block w-full"
        aria-label={`Open ${asset.title}`}
        disabled={generating}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <img
            src={asset.thumbnail}
            alt={asset.title}
            className={cn(
              'h-full w-full object-cover transition-transform duration-200',
              !generating && 'group-hover:scale-[1.03]',
              generating && 'opacity-40',
            )}
          />

          {/* type / duration badge */}
          {asset.type === 'video' && !generating && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
              <Play size={10} className="fill-white" />
              {asset.duration}
            </span>
          )}
          {asset.favourite && !generating && (
            <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md bg-black/50 text-accent backdrop-blur group-hover:opacity-0 transition-opacity">
              <Star size={13} className="fill-accent" />
            </span>
          )}

          {/* generating overlay */}
          {generating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
              <div className="text-[12px] font-medium text-textPrimary">Generating…</div>
              <div className="h-1.5 w-4/5 overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full bg-accent-gradient transition-all duration-300"
                  style={{ width: `${asset.progress ?? 0}%` }}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  cancel(asset.id)
                }}
                className="flex items-center gap-1 rounded-lg border border-border bg-panel2 px-2.5 py-1 text-[12px] text-textSecondary hover:text-textPrimary"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          )}

          {/* hover action strip */}
          {!generating && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity duration-160 group-hover:opacity-100">
              <div className="pointer-events-auto flex items-center gap-1">
                <ActionBtn label="Recreate" onClick={() => actions.recreate(asset)}>
                  <RefreshCw size={14} />
                </ActionBtn>
                <ActionBtn label="Use as reference" onClick={() => actions.useAsReference(asset)}>
                  <ImageDown size={14} />
                </ActionBtn>
                <ActionBtn label="Download" onClick={() => actions.download(asset)}>
                  <Download size={14} />
                </ActionBtn>
              </div>
            </div>
          )}
        </div>
      </button>

      {/* three-dot menu */}
      {!generating && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-160 group-hover:opacity-100">
          <Popover
            align="right"
            trigger={
              <button
                className="grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white backdrop-blur hover:bg-black/80"
                aria-label="Asset actions"
              >
                <MoreHorizontal size={15} />
              </button>
            }
            panelClassName="w-[188px]"
          >
            {(close) => <AssetMenu asset={asset} close={close} />}
          </Popover>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 px-2.5 py-2">
        <div className="min-w-0">
          <div className="truncate text-[12px] font-medium text-textPrimary">{asset.title}</div>
          <div className="truncate text-[11px] text-textMuted">
            {asset.model} · {asset.useCaseTitle ?? (asset.type === 'image' ? 'Image' : 'Video')}
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_FAVOURITE', id: asset.id })}
          className={cn(
            'shrink-0 rounded p-1 transition-colors',
            asset.favourite ? 'text-accent' : 'text-textMuted hover:text-textPrimary',
          )}
          aria-label="Toggle favourite"
        >
          <Star size={14} className={asset.favourite ? 'fill-accent' : ''} />
        </button>
      </div>
    </div>
  )
}

function ActionBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip label={label}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        aria-label={label}
        className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
      >
        {children}
      </button>
    </Tooltip>
  )
}
