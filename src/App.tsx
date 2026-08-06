import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProjectsProvider } from './contexts/ProjectsContext'
import { ProposalProvider } from './contexts/ProposalContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { useProjects } from './contexts/ProjectsContext'

function AppRoutes() {
  const { projects } = useProjects()

  return (
    <ProposalProvider projects={projects}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProposalProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <AppRoutes />
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
