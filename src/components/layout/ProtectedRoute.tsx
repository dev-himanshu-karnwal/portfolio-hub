import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Header } from './Header'

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, profile, loading, canManageUsers } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border border-line bg-surface px-8 py-6 text-muted shadow-sm">
          Loading…
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !canManageUsers) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  )
}
