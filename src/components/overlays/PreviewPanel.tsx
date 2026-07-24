import { Eye, Sparkles } from 'lucide-react'
import { useStore, useGeneration, costForMode, IMAGE_COST_PER_OUTPUT, VIDEO_COST_PER_OUTPUT } from '@/store/store'
import { getUseCase } from '@/data/useCases'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export function PreviewPanel() {
  const { state, dispatch } = useStore()
  const { generate } = useGeneration()
  const mode = state.mode
  const controls = state.controls[mode]
  const useCase = getUseCase(state.selectedUseCaseId[mode])
  const references = state.references[mode]
  const elements = state.elements.filter((e) => state.selectedElementIds[mode].includes(e.id))
  const perOutput = mode === 'image' ? IMAGE_COST_PER_OUTPUT : VIDEO_COST_PER_OUTPUT
  const total = costForMode(mode, controls.outputCount)

  const close = () => dispatch({ type: 'CLOSE_OVERLAY' })
  const startFrame = references.find((r) => r.role === 'startFrame')
  const endFrame = references.find((r) => r.role === 'endFrame')
  const plainRefs = references.filter((r) => r.role === 'reference' || !r.role)

  return (
    <Modal
      open
      onClose={close}
      title={
        <span className="flex items-center gap-2">
          <Eye size={18} className="text-accent" /> Preview generation
        </span>
      }
      description="Final settings check — this does not create an asset or spend credits."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Back to edit
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const ok = generate()
              if (ok) close()
            }}
          >
            <Sparkles size={15} /> Generate · {total} credits
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Row label="Mode"><span className="capitalize">{mode}</span></Row>
        <Row label="Use case">{useCase?.title ?? 'Start blank'}</Row>
        <div>
          <Label>Prompt</Label>
          <div className="mt-1 rounded-lg border border-border bg-panel2 px-3 py-2 text-[13px] text-textSecondary">
            {state.prompt[mode].trim() || <span className="italic text-textMuted">No prompt entered</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Row label="Model">{controls.model}</Row>
          <Row label="Version">{controls.version}</Row>
          <Row label="Aspect ratio">{controls.aspectRatio}</Row>
          <Row label="Resolution">{controls.resolution}</Row>
          {mode === 'video' && <Row label="Duration">{controls.duration}</Row>}
          <Row label="Output count">{controls.outputCount}</Row>
          <Row label="Project">
            {state.projects.find((p) => p.id === state.activeProjectId)?.name ?? 'No project'}
          </Row>
        </div>

        {(plainRefs.length > 0 || startFrame || endFrame) && (
          <div>
            <Label>References & frames</Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {startFrame && <FrameThumb src={startFrame.thumbnail} tag="Start" />}
              {endFrame && <FrameThumb src={endFrame.thumbnail} tag="End" />}
              {plainRefs.map((r) => (
                <FrameThumb key={r.id} src={r.thumbnail} tag="Ref" />
              ))}
            </div>
          </div>
        )}

        {elements.length > 0 && (
          <div>
            <Label>Elements</Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {elements.map((e) => (
                <span key={e.id} className="rounded-lg border border-border bg-panel2 px-2 py-1 text-[12px] text-textSecondary">
                  @{e.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-border bg-panel2 px-4 py-3">
          <div className="text-[13px] text-textSecondary">
            Estimated cost
            <span className="ml-2 text-textMuted">
              {perOutput} × {controls.outputCount} output{controls.outputCount === 1 ? '' : 's'}
            </span>
          </div>
          <div className="text-base font-semibold text-textPrimary">{total} credits</div>
        </div>
      </div>
    </Modal>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-wide text-textMuted">{children}</div>
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-0.5 text-[13px] text-textPrimary">{children}</div>
    </div>
  )
}

function FrameThumb({ src, tag }: { src: string; tag: string }) {
  return (
    <div className="relative">
      <img src={src} alt="" className="h-14 w-14 rounded-lg border border-border object-cover" />
      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded bg-accent px-1 text-[8px] font-semibold uppercase text-white">
        {tag}
      </span>
    </div>
  )
}
