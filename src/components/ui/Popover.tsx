import {
  useEffect,
  useRef,
  useState,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '@/utils/cn'

interface PopoverProps {
  trigger: ReactElement
  children: ReactNode | ((close: () => void) => ReactNode)
  align?: 'left' | 'right' | 'center'
  side?: 'bottom' | 'top'
  className?: string
  panelClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({
  trigger,
  children,
  align = 'left',
  side = 'bottom',
  className,
  panelClassName,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolled
  const ref = useRef<HTMLDivElement>(null)

  const setOpen = (v: boolean) => {
    if (!isControlled) setUncontrolled(v)
    onOpenChange?.(v)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const alignCls =
    align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
  const sideCls = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'

  const triggerEl = cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      trigger.props.onClick?.(e)
      setOpen(!open)
    },
    'aria-expanded': open,
    'aria-haspopup': true,
  })

  return (
    <div className={cn('relative inline-flex', className)} ref={ref}>
      {triggerEl}
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-[70] min-w-[200px] rounded-xl border border-border bg-panel2 p-1.5 shadow-pop animate-scale-in origin-top',
            alignCls,
            sideCls,
            panelClassName,
          )}
        >
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  icon?: ReactNode
  children: ReactNode
  onClick?: () => void
  danger?: boolean
  selected?: boolean
  className?: string
}

export function MenuItem({ icon, children, onClick, danger, selected, className }: MenuItemProps) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors duration-120',
        danger
          ? 'text-error hover:bg-error/10'
          : 'text-textSecondary hover:bg-hover hover:text-textPrimary',
        selected && 'bg-accent/10 text-textPrimary',
        className,
      )}
    >
      {icon && <span className="shrink-0 text-current">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  )
}
