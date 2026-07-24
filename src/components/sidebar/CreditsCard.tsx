import { Coins } from 'lucide-react'
import { useStore, useToast } from '@/store/store'

export function CreditsCard() {
  const { state } = useStore()
  const toast = useToast()
  return (
    <div className="rounded-xl border border-border bg-panel p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-textSecondary">
          <Coins size={14} className="text-accent" />
          Credits
        </div>
        <span className="text-sm font-semibold text-textPrimary">
          {state.credits.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>
      <button
        onClick={() => toast('Prototype: credit top-up is simulated', 'info')}
        className="mt-2.5 w-full rounded-lg border border-accent/40 bg-accent/10 py-1.5 text-[12px] font-medium text-textPrimary hover:bg-accent/20 transition-colors"
      >
        Get more credits
      </button>
    </div>
  )
}
