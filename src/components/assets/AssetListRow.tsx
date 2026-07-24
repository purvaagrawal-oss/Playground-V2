import { MoreHorizontal, RefreshCw, ImageDown, Download, Play, Image as ImageIcon } from 'lucide-react'
import { useStore } from '@/store/store'
import { useAssetActions } from '@/hooks/useAssetActions'
import { Popover } from '@/components/ui/Popover'
import { Tooltip } from '@/components/ui/Tooltip'
import { AssetMenu } from './AssetMenu'
import { formatDate } from '@/utils/assets'
import type { Asset } from '@/types'

export function AssetListRow({ asset }: { asset: Asset }) {
  const { state } = useStore()
  const actions = useAssetActions()
  const project = state.projects.find((p) => p.id === asset.projectId)

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-panel2 px-3 py-2 transition-colors hover:border-borderStrong">
      <button
        onClick={() => actions.openDetail(asset)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <img src={asset.thumbnail} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium text-textPrimary">{asset.title}</div>
          <div className="truncate text-[11px] text-textMuted">{asset.prompt}</div>
        </div>
      </button>
      <div className="hidden w-20 items-center gap-1.5 text-[12px] text-textSecondary lg:flex">
        {asset.type === 'video' ? <Play size={13} /> : <ImageIcon size={13} />}
        <span className="capitalize">{asset.type}</span>
      </div>
      <div className="hidden w-32 truncate text-[12px] text-textSecondary xl:block">
        {project?.name ?? 'No project'}
      </div>
      <div className="hidden w-24 text-[12px] text-textMuted lg:block">{formatDate(asset.createdAt)}</div>
      <div className="flex items-center gap-1">
        <Tooltip label="Recreate">
          <button onClick={() => actions.recreate(asset)} className="grid h-8 w-8 place-items-center rounded-lg text-textMuted hover:bg-hover hover:text-textPrimary" aria-label="Recreate">
            <RefreshCw size={15} />
          </button>
        </Tooltip>
        <Tooltip label="Use as reference">
          <button onClick={() => actions.useAsReference(asset)} className="grid h-8 w-8 place-items-center rounded-lg text-textMuted hover:bg-hover hover:text-textPrimary" aria-label="Use as reference">
            <ImageDown size={15} />
          </button>
        </Tooltip>
        <Tooltip label="Download">
          <button onClick={() => actions.download(asset)} className="grid h-8 w-8 place-items-center rounded-lg text-textMuted hover:bg-hover hover:text-textPrimary" aria-label="Download">
            <Download size={15} />
          </button>
        </Tooltip>
        <Popover
          align="right"
          trigger={
            <button className="grid h-8 w-8 place-items-center rounded-lg text-textMuted hover:bg-hover hover:text-textPrimary" aria-label="More actions">
              <MoreHorizontal size={15} />
            </button>
          }
          panelClassName="w-[188px]"
        >
          {(close) => <AssetMenu asset={asset} close={close} />}
        </Popover>
      </div>
    </div>
  )
}
