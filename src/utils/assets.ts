import type { Asset, Filters, SortOption } from '@/types'

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = new Date('2026-07-24T08:41:00Z').getTime()
  const diff = Math.max(0, now - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface ApplyOptions {
  filters: Filters
  sort: SortOption
  favouriteOnly: boolean
  typeLock?: 'image' | 'video'
  projectLock?: string | null
}

export function applyAssetView(assets: Asset[], opts: ApplyOptions): Asset[] {
  const { filters, sort, favouriteOnly, typeLock, projectLock } = opts
  let list = [...assets]

  if (typeLock) list = list.filter((a) => a.type === typeLock)
  else if (filters.assetType !== 'all') list = list.filter((a) => a.type === filters.assetType)

  if (projectLock !== undefined && projectLock !== null) {
    list = list.filter((a) => a.projectId === projectLock)
  }

  if (favouriteOnly) list = list.filter((a) => a.favourite)

  if (filters.date !== 'all') {
    const now = new Date('2026-07-24T08:41:00Z').getTime()
    const windows: Record<string, number> = {
      today: 86400000,
      week: 7 * 86400000,
      month: 30 * 86400000,
    }
    const w = windows[filters.date]
    if (w) list = list.filter((a) => now - new Date(a.createdAt).getTime() <= w)
  }

  // Generating assets always float to the top regardless of sort.
  list.sort((a, b) => {
    if (a.status === 'generating' && b.status !== 'generating') return -1
    if (b.status === 'generating' && a.status !== 'generating') return 1
    if (sort === 'name') return a.title.localeCompare(b.title)
    const at = new Date(a.createdAt).getTime()
    const bt = new Date(b.createdAt).getTime()
    return sort === 'oldest' ? at - bt : bt - at
  })

  return list
}
