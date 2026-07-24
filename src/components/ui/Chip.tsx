import { X } from 'lucide-react'
import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ChipProps {
  children: ReactNode
  onRemove?: () => void
  onClick?: () => void
  icon?: ReactNode
  variant?: 'default' | 'accent'
  className?: string
}

export function Chip({ children, onRemove, onClick, icon, variant = 'default', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium',
        variant === 'accent'
          ? 'border-accent/40 bg-accent/15 text-textPrimary'
          : 'border-border bg-panel2 text-textSecondary',
        className,
      )}
    >
      {icon}
      {onClick ? (
        <button onClick={onClick} className="hover:text-textPrimary transition-colors">
          {children}
        </button>
      ) : (
        <span>{children}</span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="rounded p-0.5 text-current hover:text-textPrimary hover:bg-white/10 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}
