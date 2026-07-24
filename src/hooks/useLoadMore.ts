import { useMemo } from 'react'
import { useStore } from '@/store/store'
import { MORE_ASSETS } from '@/data/assets'

export function useLoadMore() {
  const { state, dispatch } = useStore()
  const existingIds = useMemo(() => new Set(state.assets.map((a) => a.id)), [state.assets])
  const remaining = MORE_ASSETS.filter((a) => !existingIds.has(a.id))

  const onLoadMore = () => {
    const batch = remaining.slice(0, 5).map((a) => ({
      ...a,
      // assign into the active project so it stays visible in project-scoped views
      projectId: a.projectId,
    }))
    if (batch.length) dispatch({ type: 'ADD_ASSETS', assets: batch })
  }

  return { onLoadMore, canLoadMore: remaining.length > 0 }
}
