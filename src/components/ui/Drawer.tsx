import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Portal } from './Portal'
import { useFocusTrap } from './useFocusTrap'
import { cn } from '@/utils/cn'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: string
}

export function Drawer({ open, onClose, title, children, footer, width = 'w-[460px]' }: DrawerProps) {
  const ref = useFocusTrap<HTMLDivElement>(open, onClose)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-[90]">
        <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            'absolute right-0 top-0 flex h-full flex-col border-l border-border bg-panel shadow-pop animate-slide-in-right',
            width,
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-textPrimary">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-textMuted hover:bg-hover hover:text-textPrimary transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <div className="border-t border-border px-5 py-3.5">{footer}</div>
          )}
        </div>
      </div>
    </Portal>
  )
}
