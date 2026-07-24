import { useState } from 'react'
import { Wand2, Play } from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { makeThumb } from '@/utils/thumbnails'

export function EditAssetDrawer({ assetId }: { assetId?: string }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const asset = state.assets.find((a) => a.id === assetId)
  const [instruction, setInstruction] = useState('')
  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })

  if (!asset) return null

  const apply = () => {
    if (!instruction.trim()) {
      toast('Describe the edit you want to make', 'error')
      return
    }
    const id = `edit-${Date.now()}`
    dispatch({
      type: 'ADD_ASSET',
      asset: {
        ...asset,
        id,
        title: `${asset.title} (edit)`,
        thumbnail: makeThumb(id, 'cinematic', `${asset.title} (edit)`),
        prompt: `${asset.prompt}\n\nEdit: ${instruction.trim()}`,
        createdAt: new Date().toISOString(),
        favourite: false,
        references: [
          {
            id: `ref-${id}`,
            assetId: asset.id,
            thumbnail: asset.thumbnail,
            label: `${asset.title} (source)`,
            role: 'reference',
          },
        ],
        status: 'ready',
      },
    })
    toast('Edit applied — new version created', 'success')
    close()
  }

  return (
    <Drawer
      open
      onClose={close}
      title={asset.type === 'image' ? 'Edit image' : 'Edit video'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={apply}>
            <Wand2 size={15} /> Apply edit
          </Button>
        </div>
      }
    >
      <div className="relative mb-4 overflow-hidden rounded-xl border border-border">
        <img src={asset.thumbnail} alt={asset.title} className="w-full object-cover" />
        {asset.type === 'video' && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white backdrop-blur">
            <Play size={11} className="fill-white" /> {asset.duration}
          </span>
        )}
      </div>

      <label className="mb-1 block text-[12px] font-medium text-textSecondary">Edit instruction</label>
      <textarea
        autoFocus
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="e.g. Make the lighting warmer and add rain in the background…"
        rows={4}
        className="w-full resize-none rounded-lg border border-border bg-panel2 px-3 py-2 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
      />

      <div className="mt-4">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-textMuted">
          Source reference
        </div>
        <img src={asset.thumbnail} alt="" className="h-16 w-16 rounded-lg border border-border object-cover" />
      </div>

      <p className="mt-4 rounded-lg border border-border bg-panel2 px-3 py-2 text-[12px] text-textMuted">
        Prototype: applying an edit simulates a new derived generation based on this asset.
      </p>
    </Drawer>
  )
}
