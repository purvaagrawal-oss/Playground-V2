import { ChevronDown, Check } from 'lucide-react'
import { Popover, MenuItem } from '@/components/ui/Popover'
import { cn } from '@/utils/cn'

interface Option {
  value: string
  label?: string
  blurb?: string
}

interface ControlSelectProps {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  icon?: React.ReactNode
  className?: string
  align?: 'left' | 'right'
}

export function ControlSelect({ label, value, options, onChange, icon, className, align = 'left' }: ControlSelectProps) {
  return (
    <Popover
      side="top"
      align={align}
      className={className}
      panelClassName="w-[240px] max-h-[280px] overflow-y-auto"
      trigger={
        <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-panel2 px-2.5 text-left transition-colors hover:border-borderStrong">
          {icon && <span className="text-textMuted">{icon}</span>}
          <span className="flex flex-col leading-none">
            <span className="text-[9px] uppercase tracking-wide text-textMuted">{label}</span>
            <span className="mt-0.5 text-[12px] font-medium text-textPrimary">{value}</span>
          </span>
          <ChevronDown size={13} className="text-textMuted" />
        </button>
      }
    >
      {(close) => (
        <>
          {options.map((o) => (
            <MenuItem
              key={o.value}
              selected={o.value === value}
              onClick={() => {
                onChange(o.value)
                close()
              }}
              icon={o.value === value ? <Check size={14} /> : <span className="w-3.5" />}
            >
              <span className="flex flex-col">
                <span className={cn(o.value === value && 'text-textPrimary')}>{o.label ?? o.value}</span>
                {o.blurb && <span className="text-[11px] text-textMuted">{o.blurb}</span>}
              </span>
            </MenuItem>
          ))}
        </>
      )}
    </Popover>
  )
}
