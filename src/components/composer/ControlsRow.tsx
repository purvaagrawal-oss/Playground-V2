import { SlidersHorizontal, Cpu, Ratio, Clock, Monitor } from 'lucide-react'
import { useStore } from '@/store/store'
import { ControlSelect } from './ControlSelect'
import { Popover } from '@/components/ui/Popover'
import {
  modelsForMode,
  ASPECT_RATIOS_IMAGE,
  ASPECT_RATIOS_VIDEO,
  RESOLUTIONS_IMAGE,
  RESOLUTIONS_VIDEO,
  DURATIONS,
  STYLES,
  LIGHTING,
} from '@/data/models'

export function ControlsRow() {
  const { state, dispatch } = useStore()
  const mode = state.mode
  const controls = state.controls[mode]
  const models = modelsForMode(mode)
  const currentModel = models.find((m) => m.name === controls.model) ?? models[0]

  const set = (patch: Partial<typeof controls>) => dispatch({ type: 'SET_CONTROL', mode, patch })

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <ControlSelect
        label="Model"
        value={controls.model}
        icon={<Cpu size={14} />}
        options={models.map((m) => ({ value: m.name, blurb: m.blurb }))}
        onChange={(v) => {
          const m = models.find((x) => x.name === v)
          set({ model: v, version: m?.versions[0] ?? controls.version })
        }}
      />
      <ControlSelect
        label="Version"
        value={controls.version}
        options={currentModel.versions.map((v) => ({ value: v }))}
        onChange={(v) => set({ version: v })}
      />
      <ControlSelect
        label="Aspect"
        value={controls.aspectRatio}
        icon={<Ratio size={14} />}
        options={(mode === 'image' ? ASPECT_RATIOS_IMAGE : ASPECT_RATIOS_VIDEO).map((v) => ({ value: v }))}
        onChange={(v) => set({ aspectRatio: v })}
      />
      {mode === 'video' && (
        <ControlSelect
          label="Duration"
          value={controls.duration}
          icon={<Clock size={14} />}
          options={DURATIONS.map((v) => ({ value: v }))}
          onChange={(v) => set({ duration: v })}
        />
      )}
      <ControlSelect
        label="Resolution"
        value={controls.resolution}
        icon={<Monitor size={14} />}
        options={(mode === 'image' ? RESOLUTIONS_IMAGE : RESOLUTIONS_VIDEO).map((v) => ({ value: v }))}
        onChange={(v) => set({ resolution: v })}
      />

      <Popover
        side="top"
        align="right"
        panelClassName="w-[280px]"
        trigger={
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-panel2 px-2.5 text-[12px] text-textSecondary transition-colors hover:border-borderStrong hover:text-textPrimary">
            <SlidersHorizontal size={14} />
            More settings
          </button>
        }
      >
        <div className="space-y-3 p-2">
          <FieldRow label="Output count">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => set({ outputCount: n })}
                  className={`h-7 w-7 rounded-lg border text-[12px] transition-colors ${
                    controls.outputCount === n
                      ? 'border-accent/40 bg-accent/15 text-textPrimary'
                      : 'border-border text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </FieldRow>

          {mode === 'image' ? (
            <>
              <FieldRow label="Style">
                <MiniSelect value={controls.style ?? 'Cinematic'} options={STYLES} onChange={(v) => set({ style: v })} />
              </FieldRow>
              <FieldRow label="Lighting">
                <MiniSelect value={controls.lighting ?? 'Natural'} options={LIGHTING} onChange={(v) => set({ lighting: v })} />
              </FieldRow>
              <FieldRow label="Negative prompt" stacked>
                <input
                  value={controls.negativePrompt ?? ''}
                  onChange={(e) => set({ negativePrompt: e.target.value })}
                  placeholder="e.g. blurry, distorted, text"
                  className="w-full rounded-lg border border-border bg-panel px-2.5 py-1.5 text-[12px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
                />
              </FieldRow>
              <FieldRow label="Seed">
                <input
                  value={controls.seed ?? ''}
                  onChange={(e) => set({ seed: e.target.value })}
                  placeholder="Random"
                  className="w-28 rounded-lg border border-border bg-panel px-2.5 py-1.5 text-[12px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
                />
              </FieldRow>
            </>
          ) : (
            <>
              <FieldRow label="Motion strength" stacked>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={controls.motionStrength ?? 50}
                  onChange={(e) => set({ motionStrength: +e.target.value })}
                  className="w-full accent-accent"
                />
              </FieldRow>
              <FieldRow label="Prompt adherence" stacked>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={controls.promptAdherence ?? 60}
                  onChange={(e) => set({ promptAdherence: +e.target.value })}
                  className="w-full accent-accent"
                />
              </FieldRow>
            </>
          )}
        </div>
      </Popover>
    </div>
  )
}

function FieldRow({
  label,
  children,
  stacked,
}: {
  label: string
  children: React.ReactNode
  stacked?: boolean
}) {
  return (
    <div className={stacked ? 'space-y-1.5' : 'flex items-center justify-between gap-2'}>
      <span className="text-[12px] text-textSecondary">{label}</span>
      {children}
    </div>
  )
}

function MiniSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-panel px-2 py-1 text-[12px] text-textPrimary focus:border-borderStrong outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
