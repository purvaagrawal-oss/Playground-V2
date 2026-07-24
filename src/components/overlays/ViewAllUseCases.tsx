import { useStore, useToast } from '@/store/store'
import { useCasesForMode } from '@/data/useCases'
import { Modal } from '@/components/ui/Modal'
import { Icon } from '@/components/ui/Icon'

export function ViewAllUseCases() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const mode = state.mode
  const useCases = useCasesForMode(mode)

  const applyPreset = (id: string) => {
    const hadPrompt = state.prompt[mode].trim().length > 0
    dispatch({ type: 'SELECT_USE_CASE', useCaseId: id })
    if (hadPrompt) toast('Use-case settings applied', 'info')
    setTimeout(() => document.getElementById('composer-prompt')?.focus(), 80)
  }

  return (
    <Modal
      open
      onClose={() => dispatch({ type: 'CLOSE_OVERLAY' })}
      title={mode === 'image' ? 'All image use cases' : 'All video use cases'}
      description="Pick a starting point. Presets apply sensible defaults without generating anything."
      size="xl"
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {useCases.map((uc) => (
          <div
            key={uc.id}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-panel2 transition-colors hover:border-borderStrong"
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={uc.thumbnail} alt="" className="h-full w-full object-cover" />
              <span
                className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-lg"
                style={{ backgroundColor: `${uc.iconColor}33`, color: uc.iconColor }}
              >
                <Icon name={uc.icon} size={16} />
              </span>
              <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur">
                {uc.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-3">
              <div className="text-[13px] font-semibold text-textPrimary">{uc.title}</div>
              <p className="mt-0.5 flex-1 text-[12px] text-textMuted">{uc.description}</p>
              <button
                onClick={() => applyPreset(uc.id)}
                className="mt-3 rounded-lg bg-accent/15 py-1.5 text-[12px] font-medium text-accent hover:bg-accent/25 transition-colors"
              >
                Use preset
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
