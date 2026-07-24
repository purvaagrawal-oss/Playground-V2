import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/app-shell/AppShell'
import { CreatePage } from './pages/CreatePage'
import { AssetsPage } from './pages/AssetsPage'
import { ElementsPage } from './pages/ElementsPage'
import { AcademyPage } from './pages/AcademyPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/create?mode=image" replace />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/assets" element={<AssetsPage filter="all" />} />
        <Route path="/assets/images" element={<AssetsPage filter="image" />} />
        <Route path="/assets/videos" element={<AssetsPage filter="video" />} />
        <Route path="/elements" element={<ElementsPage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="*" element={<Navigate to="/create?mode=image" replace />} />
      </Route>
    </Routes>
  )
}
