import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { makeThumb, avatarUri } from '@/utils/thumbnails'

export function CreateProjectModal() {
  const { dispatch } = useStore()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<string>(makeThumb('new-project', 'promo', 'New Project'))

  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })

  const onFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCover(String(reader.result))
    reader.readAsDataURL(file)
  }

  const create = () => {
    if (!name.trim()) {
      toast('Give your project a name', 'error')
      return
    }
    const id = `p-${Date.now()}`
    dispatch({
      type: 'ADD_PROJECT',
      project: {
        id,
        name: name.trim(),
        description: description.trim() || 'New creative project.',
        cover,
        assetCount: 0,
        updatedAt: new Date().toISOString(),
        members: [avatarUri('Aanya')],
      },
    })
    dispatch({ type: 'SET_ACTIVE_PROJECT', projectId: id })
    toast(`Project “${name.trim()}” created`, 'success')
    close()
  }

  return (
    <Modal
      open
      onClose={close}
      title="Create Project"
      description="Group related assets and elements together."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={create}>
            Create
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border">
          <img src={cover} alt="" className="h-full w-full object-cover" />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg border border-border bg-black/60 px-2.5 py-1.5 text-[12px] text-white backdrop-blur hover:bg-black/80"
          >
            <Upload size={13} /> Cover
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-[12px] font-medium text-textSecondary">Project name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Midnight Chronicles"
            className="w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-medium text-textSecondary">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-panel2 px-3 py-2 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
          />
        </div>
      </div>
    </Modal>
  )
}
