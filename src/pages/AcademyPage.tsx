import { useMemo, useState } from 'react'
import { Search, Play, Clock, GraduationCap } from 'lucide-react'
import { SEED_TUTORIALS, ACADEMY_CATEGORIES } from '@/data/academy'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import type { Tutorial } from '@/types'

export function AcademyPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [active, setActive] = useState<Tutorial | null>(null)

  const featured = SEED_TUTORIALS.find((t) => t.featured)!
  const rest = useMemo(() => {
    return SEED_TUTORIALS.filter((t) => {
      if (t.featured) return false
      if (category !== 'All' && t.category !== category) return false
      if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [query, category])

  return (
    <div className="px-6 py-5">
      <div>
        <h2 className="text-xl font-semibold text-textPrimary">Academy</h2>
        <p className="mt-0.5 text-[13px] text-textSecondary">
          Short guides to help your team master the create-evaluate-reuse workflow.
        </p>
      </div>

      {/* Featured */}
      <button
        onClick={() => setActive(featured)}
        className="mt-4 flex w-full overflow-hidden rounded-2xl border border-border bg-panel2 text-left transition-colors hover:border-borderStrong"
      >
        <div className="relative h-40 w-72 shrink-0 overflow-hidden">
          <img src={featured.thumbnail} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white backdrop-blur">
              <Play size={18} className="fill-white" />
            </span>
          </span>
        </div>
        <div className="flex flex-col justify-center p-5">
          <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
            <GraduationCap size={12} /> Featured · Getting started
          </span>
          <h3 className="text-lg font-semibold text-textPrimary">{featured.title}</h3>
          <p className="mt-1 max-w-lg text-[13px] text-textSecondary">{featured.description}</p>
          <div className="mt-2 flex items-center gap-3 text-[12px] text-textMuted">
            <span className="flex items-center gap-1"><Clock size={12} /> {featured.duration}</span>
            <span>{featured.difficulty}</span>
            {featured.progress ? <span>{featured.progress}% complete</span> : null}
          </div>
        </div>
      </button>

      {/* Controls */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tutorials"
            className="w-full rounded-lg border border-border bg-panel py-2 pl-9 pr-3 text-[13px] text-textPrimary placeholder:text-textMuted focus:border-borderStrong outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {['All', ...ACADEMY_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-[12px] transition-colors',
                category === c
                  ? 'border-accent/40 bg-accent/15 text-textPrimary'
                  : 'border-border text-textSecondary hover:text-textPrimary',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-5 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {rest.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t)}
            className="group overflow-hidden rounded-xl border border-border bg-panel2 text-left transition-all hover:border-borderStrong hover:-translate-y-0.5"
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={t.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur">
                <Clock size={10} /> {t.duration}
              </span>
            </div>
            <div className="p-3">
              <div className="text-[13px] font-medium text-textPrimary">{t.title}</div>
              <p className="mt-1 line-clamp-2 text-[12px] text-textMuted">{t.description}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-textMuted">
                <span>{t.category}</span>·<span>{t.difficulty}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title} size="lg">
        {active && (
          <div>
            <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-border">
              <img src={active.thumbnail} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-black/50 text-white backdrop-blur">
                  <Play size={22} className="fill-white" />
                </span>
              </span>
            </div>
            <div className="mb-3 flex items-center gap-3 text-[12px] text-textMuted">
              <span className="flex items-center gap-1"><Clock size={12} /> {active.duration}</span>
              <span>{active.difficulty}</span>
              <span>{active.category}</span>
            </div>
            <p className="text-[14px] leading-relaxed text-textSecondary">{active.body}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={() => setActive(null)}>Got it</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
