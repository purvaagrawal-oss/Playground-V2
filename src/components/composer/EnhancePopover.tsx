import { useMemo } from 'react'
import { Wand2 } from 'lucide-react'
import { Popover } from '@/components/ui/Popover'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/store'
import { enhancePrompt } from '@/utils/enhance'

export function EnhancePopover() {
  const { state, dispatch } = useStore()
  const mode = state.mode
  const original = state.prompt[mode]

  return (
    <Popover
      side="top"
      align="left"
      panelClassName="w-[380px] p-3"
      trigger={
        <button className="flex items-center gap-1.5 rounded-lg border border-border bg-panel2 px-2.5 py-1.5 text-[12px] text-textSecondary transition-colors hover:border-borderStrong hover:text-textPrimary">
          <Wand2 size={14} />
          Enhance
        </button>
      }
    >
      {(close) => <EnhanceContent original={original} mode={mode} onApply={(v) => { dispatch({ type: 'SET_PROMPT', mode, value: v }); close() }} onKeep={close} />}
    </Popover>
  )
}

function EnhanceContent({
  original,
  mode,
  onApply,
  onKeep,
}: {
  original: string
  mode: 'image' | 'video'
  onApply: (v: string) => void
  onKeep: () => void
}) {
  const enhanced = useMemo(() => enhancePrompt(original, mode), [original, mode])
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-textMuted">Original</div>
        <div className="rounded-lg border border-border bg-panel px-2.5 py-2 text-[12px] text-textSecondary">
          {original.trim() || <span className="italic text-textMuted">Empty prompt</span>}
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
          <Wand2 size={12} /> Enhanced
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/5 px-2.5 py-2 text-[12px] text-textPrimary">
          {enhanced}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onKeep}>
          Keep original
        </Button>
        <Button size="sm" variant="primary" onClick={() => onApply(enhanced)}>
          Use enhanced prompt
        </Button>
      </div>
    </div>
  )
}
