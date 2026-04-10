import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../ui/Spinner'

export function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth/login" replace />

  if (role && profile?.role !== role && profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
