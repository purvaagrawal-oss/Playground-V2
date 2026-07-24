import {
  RefreshCw,
  ImageDown,
  Download,
  Clapperboard,
  Wand2,
  Sparkles,
  Play,
  Copy,
  Star,
  Trash2,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { useAssetActions } from '@/hooks/useAssetActions'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/assets'

export function AssetDetailDrawer({ assetId }: { assetId?: string }) {
  const { state, dispatch } = useStore()
  const actions = useAssetActions()
  const asset = state.assets.find((a) => a.id === assetId)
  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })

  if (!asset) return null

  const project = state.projects.find((p) => p.id === asset.projectId)
  const elements = state.elements.filter((e) => asset.elementIds.includes(e.id))

  return (
    <Drawer open onClose={close} title={asset.title} width="w-[480px]">
      <div className="relative mb-4 overflow-hidden rounded-xl border border-border">
        <img src={asset.thumbnail} alt={asset.title} className="w-full object-cover" />
        {asset.type === 'video' && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white backdrop-blur">
            <Play size={11} className="fill-white" /> {asset.duration}
          </span>
        )}
      </div>

      {/* primary actions */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Button variant="primary" size="sm" onClick={() => actions.recreate(asset)}>
          <RefreshCw size={14} /> Recreate
        </Button>
        <Button variant="secondary" size="sm" onClick={() => actions.useAsReference(asset)}>
          <ImageDown size={14} /> Reference
        </Button>
        <Button variant="secondary" size="sm" onClick={() => actions.download(asset)}>
          <Download size={14} /> Download
        </Button>
      </div>

      {/* contextual actions */}
      <div className="mb-4 flex flex-wrap gap-2">
        {asset.type === 'image' ? (
          <>
            <Button variant="outline" size="sm" onClick={() => actions.turnIntoVideo(asset)}>
              <Clapperboard size={14} /> Turn into video
            </Button>
            <Button variant="outline" size="sm" onClick={() => actions.editAsset(asset)}>
              <Wand2 size={14} /> Edit image
            </Button>
            <Button variant="outline" size="sm" onClick={() => actions.createElement(asset)}>
              <Sparkles size={14} /> Create Element
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => actions.continueVideo(asset)}>
              <Play size={14} /> Continue video
            </Button>
            <Button variant="outline" size="sm" onClick={() => actions.editAsset(asset)}>
              <Wand2 size={14} /> Edit video
            </Button>
          </>
        )}
      </div>

      {/* metadata */}
      <div className="space-y-3">
        <Meta label="Prompt">
          <p className="text-[13px] leading-relaxed text-textSecondary">{asset.prompt}</p>
        </Meta>
        <div className="grid grid-cols-2 gap-3">
          <Meta label="Type"><Val>{asset.type}</Val></Meta>
          <Meta label="Use case"><Val>{asset.useCaseTitle ?? '—'}</Val></Meta>
          <Meta label="Model"><Val>{asset.model} {asset.version}</Val></Meta>
          <Meta label="Aspect ratio"><Val>{asset.aspectRatio}</Val></Meta>
          <Meta label="Resolution"><Val>{asset.resolution}</Val></Meta>
          {asset.type === 'video' && <Meta label="Duration"><Val>{asset.duration}</Val></Meta>}
          <Meta label="Output count"><Val>{asset.outputCount}</Val></Meta>
          <Meta label="Project"><Val>{project?.name ?? 'No project'}</Val></Meta>
          <Meta label="Creator"><Val>{asset.creator}</Val></Meta>
          <Meta label="Created"><Val>{formatDate(asset.createdAt)}</Val></Meta>
        </div>

        {asset.references.length > 0 && (
          <Meta label="References">
            <div className="flex flex-wrap gap-2">
              {asset.references.map((r) => (
                <img key={r.id} src={r.thumbnail} alt={r.label} className="h-12 w-12 rounded-lg border border-border object-cover" />
              ))}
            </div>
          </Meta>
        )}
        {elements.length > 0 && (
          <Meta label="Elements">
            <div className="flex flex-wrap gap-1.5">
              {elements.map((e) => (
                <span key={e.id} className="rounded-lg border border-border bg-panel2 px-2 py-1 text-[12px] text-textSecondary">
                  @{e.name}
                </span>
              ))}
            </div>
          </Meta>
        )}
      </div>

      {/* secondary actions */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <Button variant="ghost" size="sm" onClick={() => actions.copyPrompt(asset)}>
          <Copy size={14} /> Copy prompt
        </Button>
        <Button variant="ghost" size="sm" onClick={() => actions.toggleFavourite(asset)}>
          <Star size={14} className={asset.favourite ? 'fill-accent text-accent' : ''} />
          {asset.favourite ? 'Favourited' : 'Add to favourites'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => actions.deleteAsset(asset)}>
          <Trash2 size={14} /> Delete
        </Button>
      </div>
    </Drawer>
  )
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-textMuted">{label}</div>
      {children}
    </div>
  )
}

function Val({ children }: { children: React.ReactNode }) {
  return <div className="text-[13px] capitalize text-textPrimary">{children}</div>
}
