import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { useStore, useToast } from '@/store/store'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { makeThumb } from '@/utils/thumbnails'
import { cn } from '@/utils/cn'
import type { ElementType } from '@/types'

const TYPES: ElementType[] = ['Character', 'Location', 'Object']

export function CreateElementModal({ payload }: { payload?: { sourceAssetId?: string; projectId?: string } }) {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const sourceAsset = state.assets.find((a) => a.id === payload?.sourceAssetId)
  const [image, setImage] = useState<string>(sourceAsset?.thumbnail ?? makeThumb('new-element', 'character', 'New Element'))
  const [name, setName] = useState('')
  const [type, setType] = useState<ElementType>('Character')
  const [description, setDescription] = useState('')

  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })

  const onFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  const create = () => {
    if (!name.trim()) {
      toast('Give your element a name', 'error')
      return
    }
    const id = `el-${Date.now()}`
    dispatch({
      type: 'ADD_ELEMENT',
      element: {
        id,
        name: name.trim(),
        type,
        thumbnail: image,
        description: description.trim(),
        projectIds: payload?.projectId ? [payload.projectId] : [],
        updatedAt: new Date().toISOString(),
      },
    })
    toast(`Element “${name.trim()}” created`, 'success')
    close()
  }

  return (
    <Modal
      open
      onClose={close}
      title="Create Element"
      description="Save a reusable character, location or object."
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
      <div className="flex gap-4">
        <div className="w-32 shrink-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-panel2 py-1.5 text-[12px] text-textSecondary hover:text-textPrimary transition-colors"
          >
            <Upload size={13} /> Replace
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <Field label="Name">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aanya"
              className="w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
            />
          </Field>
          <Field label="Type">
            <div className="flex gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    'flex-1 rounded-lg border px-2 py-1.5 text-[12px] transition-colors',
                    type === t
                      ? 'border-accent/40 bg-accent/15 text-textPrimary'
                      : 'border-border text-textSecondary hover:text-textPrimary',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Description (optional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key traits to keep consistent…"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-panel2 px-3 py-2 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
            />
          </Field>
        </div>
      </div>
    </Modal>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-textSecondary">{label}</label>
      {children}
    </div>
  )
}
