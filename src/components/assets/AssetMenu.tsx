import { useState } from 'react'
import {
  Clapperboard,
  Sparkles,
  Wand2,
  Copy,
  FolderInput,
  Star,
  Trash2,
  ChevronLeft,
  Check,
  Play,
} from 'lucide-react'
import { MenuItem } from '@/components/ui/Popover'
import { useStore } from '@/store/store'
import { useAssetActions } from '@/hooks/useAssetActions'
import type { Asset } from '@/types'

export function AssetMenu({ asset, close }: { asset: Asset; close: () => void }) {
  const { state } = useStore()
  const actions = useAssetActions()
  const [view, setView] = useState<'root' | 'project'>('root')

  if (view === 'project') {
    return (
      <div className="max-h-[260px] overflow-y-auto">
        <button
          onClick={() => setView('root')}
          className="mb-1 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-textMuted hover:text-textPrimary"
        >
          <ChevronLeft size={14} /> Move to project
        </button>
        <MenuItem
          selected={asset.projectId === null}
          icon={asset.projectId === null ? <Check size={14} /> : <span className="w-3.5" />}
          onClick={() => { actions.moveToProject(asset, null); close() }}
        >
          No project
        </MenuItem>
        {state.projects.map((p) => (
          <MenuItem
            key={p.id}
            selected={asset.projectId === p.id}
            icon={asset.projectId === p.id ? <Check size={14} /> : <span className="w-3.5" />}
            onClick={() => { actions.moveToProject(asset, p.id); close() }}
          >
            {p.name}
          </MenuItem>
        ))}
      </div>
    )
  }

  return (
    <>
      {asset.type === 'image' ? (
        <>
          <MenuItem icon={<Clapperboard size={15} />} onClick={() => { actions.turnIntoVideo(asset); close() }}>
            Turn into video
          </MenuItem>
          <MenuItem icon={<Sparkles size={15} />} onClick={() => { actions.createElement(asset); close() }}>
            Create Element
          </MenuItem>
          <MenuItem icon={<Wand2 size={15} />} onClick={() => { actions.editAsset(asset); close() }}>
            Edit image
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem icon={<Play size={15} />} onClick={() => { actions.continueVideo(asset); close() }}>
            Continue video
          </MenuItem>
          <MenuItem icon={<Wand2 size={15} />} onClick={() => { actions.editAsset(asset); close() }}>
            Edit video
          </MenuItem>
        </>
      )}
      <MenuItem icon={<Copy size={15} />} onClick={() => { actions.copyPrompt(asset); close() }}>
        Copy prompt
      </MenuItem>
      <MenuItem icon={<FolderInput size={15} />} onClick={() => setView('project')}>
        Move to Project
      </MenuItem>
      <MenuItem icon={<Star size={15} />} onClick={() => { actions.toggleFavourite(asset); close() }}>
        {asset.favourite ? 'Remove favourite' : 'Add to favourites'}
      </MenuItem>
      <div className="my-1 h-px bg-border" />
      <MenuItem icon={<Trash2 size={15} />} danger onClick={() => { actions.deleteAsset(asset); close() }}>
        Delete
      </MenuItem>
    </>
  )
}
