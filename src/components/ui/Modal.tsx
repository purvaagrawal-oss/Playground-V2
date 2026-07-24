import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Portal } from './Portal'
import { useFocusTrap } from './useFocusTrap'
import { cn } from '@/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md', className }: ModalProps) {
  const ref = useFocusTrap<HTMLDivElement>(open, onClose)
  if (!open) return null
  return (
    <Portal>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in"
          onClick={onClose}
        />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-10 flex max-h-[86vh] w-full flex-col rounded-2xl border border-border bg-panel shadow-pop animate-scale-in',
            sizes[size],
            className,
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                {title && <h2 className="text-base font-semibold text-textPrimary">{title}</h2>}
                {description && (
                  <p className="mt-0.5 text-[13px] text-textSecondary">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-textMuted hover:bg-hover hover:text-textPrimary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  )
}
