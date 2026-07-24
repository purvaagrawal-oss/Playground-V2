import { useEffect, useRef } from 'react'
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Paperclip,
  AtSign,
  Sparkles,
  Eye,
  X,
  Frame,
} from 'lucide-react'
import { useStore, useGeneration, costForMode } from '@/store/store'
import { getUseCase } from '@/data/useCases'
import { ControlsRow } from './ControlsRow'
import { EnhancePopover } from './EnhancePopover'
import { Chip } from '@/components/ui/Chip'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/utils/cn'
import type { Mode } from '@/types'

const PROMPT_LIMIT = 2000

export function Composer() {
  const { state, dispatch } = useStore()
  const { generate } = useGeneration()
  const mode = state.mode
  const prompt = state.prompt[mode]
  const controls = state.controls[mode]
  const useCase = getUseCase(state.selectedUseCaseId[mode])
  const references = state.references[mode]
  const selectedElements = state.elements.filter((e) =>
    state.selectedElementIds[mode].includes(e.id),
  )
  const cost = costForMode(mode, controls.outputCount)

  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [prompt, mode])

  const setMode = (m: Mode) => {
    dispatch({ type: 'SET_MODE', mode: m, openRail: true })
  }

  const onPromptChange = (value: string) => {
    if (value.length > PROMPT_LIMIT) value = value.slice(0, PROMPT_LIMIT)
    const justTypedAt = value.length === prompt.length + 1 && value.endsWith('@')
    dispatch({ type: 'SET_PROMPT', mode, value })
    if (justTypedAt) {
      dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'elementPicker', payload: { fromAt: true } } })
    }
  }

  const needsStartFrame =
    mode === 'video' &&
    state.selectedUseCaseId.video === 'vid-image-to-video' &&
    !references.some((r) => r.role === 'startFrame')

  return (
    <div className="shrink-0 border-t border-border bg-app px-5 py-3">
      <div className="mx-auto flex w-full max-w-[1280px] gap-3">
        {/* LEFT — mode switcher */}
        <div className="flex flex-col gap-1.5">
          <ModeButton active={mode === 'image'} onClick={() => setMode('image')} icon={<ImageIcon size={18} />} label="Image" />
          <ModeButton active={mode === 'video'} onClick={() => setMode('video')} icon={<VideoIcon size={18} />} label="Video" />
        </div>

        {/* CENTRE */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border border-border bg-panel p-3">
          {/* top actions + chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <EnhancePopover />
            <button
              onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'referencePicker', payload: { target: 'reference' } } })}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-panel2 px-2.5 py-1.5 text-[12px] text-textSecondary transition-colors hover:border-borderStrong hover:text-textPrimary"
            >
              <Paperclip size={14} />
              Add reference
            </button>
            <button
              onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'elementPicker' } })}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-panel2 px-2.5 py-1.5 text-[12px] text-textSecondary transition-colors hover:border-borderStrong hover:text-textPrimary"
            >
              <AtSign size={14} />
              Elements
            </button>

            {useCase && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-accent/40 bg-accent/15 px-2 py-1 text-[12px] font-medium text-textPrimary">
                <Sparkles size={12} className="text-accent" />
                {useCase.title}
                <button
                  onClick={() => dispatch({ type: 'SET_MODE', mode, openRail: true })}
                  className="ml-1 rounded px-1 text-[11px] text-accent hover:underline"
                >
                  Change
                </button>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_USE_CASE', mode })}
                  aria-label="Remove use case"
                  className="rounded p-0.5 hover:bg-white/10"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedElements.map((el) => (
              <Chip
                key={el.id}
                variant="accent"
                icon={<AtSign size={11} className="text-accent" />}
                onRemove={() => dispatch({ type: 'TOGGLE_ELEMENT', mode, id: el.id })}
              >
                {el.name}
              </Chip>
            ))}
          </div>

          {/* references / start frame */}
          {(references.length > 0 || needsStartFrame) && (
            <div className="flex flex-wrap items-center gap-2">
              {references.map((r) => (
                <div key={r.id} className="group relative">
                  <img src={r.thumbnail} alt={r.label} className="h-12 w-12 rounded-lg border border-border object-cover" />
                  {r.role && r.role !== 'reference' && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded bg-accent px-1 text-[8px] font-semibold uppercase text-white">
                      {r.role === 'startFrame' ? 'Start' : 'End'}
                    </span>
                  )}
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_REFERENCE', mode, id: r.id })}
                    className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-panel2 text-textMuted opacity-0 transition-opacity hover:text-textPrimary group-hover:opacity-100"
                    aria-label="Remove reference"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {needsStartFrame && (
                <button
                  onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'referencePicker', payload: { target: 'startFrame' } } })}
                  className="flex h-12 items-center gap-1.5 rounded-lg border border-dashed border-accent/50 bg-accent/5 px-3 text-[12px] font-medium text-accent hover:bg-accent/10"
                >
                  <Frame size={14} />
                  Choose a start frame
                </button>
              )}
            </div>
          )}

          {/* textarea */}
          <div className="relative">
            <textarea
              id="composer-prompt"
              ref={taRef}
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder={
                useCase?.placeholder ??
                (mode === 'image'
                  ? 'Describe the image you want to create…'
                  : 'Describe the video you want to create…')
              }
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-textPrimary placeholder:text-textMuted outline-none"
              style={{ maxHeight: 120 }}
            />
            {prompt.length > 0 && (
              <span className="pointer-events-none absolute bottom-0 right-0 text-[10px] text-textMuted">
                {prompt.length.toLocaleString()} / {PROMPT_LIMIT.toLocaleString()}
              </span>
            )}
          </div>

          {/* controls */}
          <div className="flex items-end justify-between gap-2">
            <ControlsRow />
          </div>
        </div>

        {/* RIGHT — generate + preview */}
        <div className="flex w-[150px] shrink-0 flex-col gap-2">
          <button
            onClick={() => generate()}
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-accent-gradient px-4 py-3 text-white shadow-[0_4px_18px_rgba(229,0,90,0.4)] transition-all hover:bg-accent-gradient-hover"
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles size={16} />
              Generate
            </span>
            <span className="text-[11px] text-white/80">{cost} credits</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'preview' } })}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-borderStrong bg-panel2 px-4 py-2.5 text-[13px] font-medium text-textPrimary transition-colors hover:bg-hover"
          >
            <Eye size={15} />
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <Tooltip label={`${label} mode`} side="right">
      <button
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          'flex h-[70px] w-[58px] flex-col items-center justify-center gap-1 rounded-xl border transition-colors duration-160',
          active
            ? 'border-accent/40 bg-accent/15 text-accent'
            : 'border-border bg-panel2 text-textSecondary hover:text-textPrimary hover:border-borderStrong',
        )}
      >
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </button>
    </Tooltip>
  )
}
