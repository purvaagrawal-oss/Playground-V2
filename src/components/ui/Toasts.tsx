import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { useStore } from '@/store/store'
import { Portal } from './Portal'
import type { ToastItem } from '@/types'

const iconFor = (v: ToastItem['variant']) => {
  switch (v) {
    case 'success':
      return <CheckCircle2 size={18} className="text-success" />
    case 'error':
      return <XCircle size={18} className="text-error" />
    case 'warning':
      return <AlertTriangle size={18} className="text-warning" />
    default:
      return <Info size={18} className="text-textSecondary" />
  }
}

export function Toasts() {
  const { state, dispatch } = useStore()
  if (state.toasts.length === 0) return null
  return (
    <Portal>
      <div className="fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 flex-col items-center gap-2">
        {state.toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex items-center gap-3 rounded-xl border border-border bg-panel2/95 px-4 py-2.5 shadow-pop animate-slide-in-left backdrop-blur"
          >
            {iconFor(t.variant)}
            <span className="text-[13px] text-textPrimary">{t.message}</span>
            <button
              onClick={() => dispatch({ type: 'DISMISS_TOAST', id: t.id })}
              className="ml-1 rounded p-0.5 text-textMuted hover:text-textPrimary"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </Portal>
  )
}
