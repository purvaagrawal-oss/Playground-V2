import { useRef, useState } from 'react'
import { Upload, Clock, FolderOpen } from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/utils/cn'
import type { Asset, Reference } from '@/types'

type Tab = 'upload' | 'recent' | 'project'

export function ReferencePicker({ target }: { target: 'reference' | 'startFrame' | 'endFrame' }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const mode = state.mode
  const [tab, setTab] = useState<Tab>('recent')
  const fileRef = useRef<HTMLInputElement>(null)

  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })

  const framesOnly = target !== 'reference'
  const filterAsset = (a: Asset) => {
    if (framesOnly) return a.type === 'image'
    if (mode === 'image') return a.type === 'image'
    return true
  }

  const recent = state.assets.filter((a) => a.status === 'ready' && filterAsset(a)).slice(0, 12)
  const projectAssets = state.assets.filter(
    (a) => a.status === 'ready' && a.projectId === state.activeProjectId && filterAsset(a),
  )

  const addRef = (thumbnail: string, label: string, assetId?: string) => {
    const reference: Reference = {
      id: `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      assetId,
      thumbnail,
      label,
      role: target,
    }
    dispatch({ type: 'ADD_REFERENCE', mode, reference })
    toast(
      target === 'startFrame'
        ? 'Start frame added'
        : target === 'endFrame'
          ? 'End frame added'
          : 'Reference attached',
      'success',
    )
    close()
  }

  const onFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => addRef(String(reader.result), file.name)
    reader.readAsDataURL(file)
  }

  const title =
    target === 'startFrame' ? 'Choose a start frame' : target === 'endFrame' ? 'Choose an end frame' : 'Add reference'

  return (
    <Modal open onClose={close} title={title} size="lg">
      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-panel2 p-1">
        <TabBtn active={tab === 'upload'} onClick={() => setTab('upload')} icon={<Upload size={14} />}>
          Upload
        </TabBtn>
        <TabBtn active={tab === 'recent'} onClick={() => setTab('recent')} icon={<Clock size={14} />}>
          Recent assets
        </TabBtn>
        <TabBtn active={tab === 'project'} onClick={() => setTab('project')} icon={<FolderOpen size={14} />}>
          Project assets
        </TabBtn>
      </div>

      {tab === 'upload' && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-borderStrong bg-panel2/50 py-12 text-textSecondary hover:border-accent/50 hover:text-textPrimary transition-colors"
          >
            <Upload size={24} />
            <span className="text-[13px] font-medium">Click to upload an image</span>
            <span className="text-[12px] text-textMuted">PNG or JPG · prototype stores it locally</span>
          </button>
        </div>
      )}

      {tab !== 'upload' && (
        <PickGrid assets={tab === 'recent' ? recent : projectAssets} onPick={(a) => addRef(a.thumbnail, a.title, a.id)} />
      )}
    </Modal>
  )
}

function PickGrid({ assets, onPick }: { assets: Asset[]; onPick: (a: Asset) => void }) {
  if (assets.length === 0) {
    return <p className="py-10 text-center text-[13px] text-textMuted">No matching assets available.</p>
  }
  return (
    <div className="grid max-h-[340px] grid-cols-4 gap-2 overflow-y-auto">
      {assets.map((a) => (
        <button
          key={a.id}
          onClick={() => onPick(a)}
          className="group relative overflow-hidden rounded-lg border border-border hover:border-accent/60 transition-colors"
        >
          <img src={a.thumbnail} alt={a.title} className="aspect-square w-full object-cover" />
          <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-1 text-left text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
            {a.title}
          </span>
        </button>
      ))}
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] font-medium transition-colors',
        active ? 'bg-hover text-textPrimary' : 'text-textSecondary hover:text-textPrimary',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
