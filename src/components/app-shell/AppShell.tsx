import { useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useStore } from '@/store/store'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Header } from '@/components/app-shell/Header'
import { UseCaseRail } from '@/components/use-cases/UseCaseRail'
import { Composer } from '@/components/composer/Composer'
import { OverlayHost } from '@/components/overlays/OverlayHost'
import { Toasts } from '@/components/ui/Toasts'

function useRouteMeta() {
  const location = useLocation()
  const params = useParams()
  const { state } = useStore()
  const path = location.pathname

  const isCreate = path === '/create'
  const composerVisible =
    isCreate ||
    path === '/assets' ||
    path === '/assets/images' ||
    path === '/assets/videos' ||
    path.startsWith('/projects/')
  const railAllowed = isCreate

  let title = 'Playground'
  if (isCreate) title = state.mode === 'image' ? 'Image generation' : 'Video generation'
  else if (path === '/assets') title = 'All assets'
  else if (path === '/assets/images') title = 'Images'
  else if (path === '/assets/videos') title = 'Videos'
  else if (path === '/elements') title = 'My elements'
  else if (path === '/academy') title = 'Academy'
  else if (path === '/projects') title = 'Projects'
  else if (path.startsWith('/projects/')) {
    const proj = state.projects.find((p) => p.id === params.projectId)
    title = proj?.name ?? 'Project'
  }

  const showProjectSelector = composerVisible
  return { isCreate, composerVisible, railAllowed, title, showProjectSelector }
}

export function AppShell() {
  const { state, dispatch } = useStore()
  const meta = useRouteMeta()
  const location = useLocation()

  // Close the use-case rail whenever we leave the creative workspace.
  useEffect(() => {
    if (!meta.railAllowed && state.useCaseRailOpen) {
      dispatch({ type: 'CLOSE_RAIL' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, meta.railAllowed])

  // Global Cmd/Ctrl+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        dispatch({ type: 'OPEN_OVERLAY', overlay: { type: 'search' } })
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [dispatch])

  const railOpen = meta.railAllowed && state.useCaseRailOpen

  return (
    <div className="flex h-screen w-full overflow-hidden bg-app">
      <Sidebar />
      {railOpen && <UseCaseRail />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={meta.title} showProjectSelector={meta.showProjectSelector} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
        {meta.composerVisible && <Composer />}
      </div>
      <OverlayHost />
      <Toasts />
    </div>
  )
}
