import { ChevronDown, User, Building2, LogOut, RotateCcw } from 'lucide-react'
import { useToast, resetPrototype } from '@/store/store'
import { Popover, MenuItem } from '@/components/ui/Popover'
import { avatarUri } from '@/utils/thumbnails'

export function UserCard() {
  const toast = useToast()
  return (
    <Popover
      side="top"
      align="left"
      className="w-full"
      panelClassName="w-[192px]"
      trigger={
        <button className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-panel p-2 text-left hover:bg-hover transition-colors">
          <img src={avatarUri('Aanya')} alt="Aanya" className="h-8 w-8 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-textPrimary">Aanya</div>
            <div className="truncate text-[11px] text-textMuted">Team Pocket FM</div>
          </div>
          <ChevronDown size={15} className="text-textMuted" />
        </button>
      }
    >
      {(close) => (
        <>
          <MenuItem icon={<User size={15} />} onClick={() => { toast('Prototype: Profile', 'info'); close() }}>
            Profile
          </MenuItem>
          <MenuItem icon={<Building2 size={15} />} onClick={() => { toast('Prototype: Workspace', 'info'); close() }}>
            Workspace
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <MenuItem icon={<RotateCcw size={15} />} onClick={() => resetPrototype()}>
            Reset prototype data
          </MenuItem>
          <MenuItem icon={<LogOut size={15} />} danger onClick={() => { toast('Prototype: Signed out', 'info'); close() }}>
            Sign out
          </MenuItem>
        </>
      )}
    </Popover>
  )
}
