import { Navigate, Outlet } from 'react-router-dom'
import { getSession } from '../api'

export default function RequireAuth({ roles }) {
  const session = getSession()
  if (!session) return <Navigate to="/login" replace />
  if (!roles.includes(session.user.role)) {
    return <Navigate to={session.user.role === 'resident' ? '/portal' : '/'} replace />
  }
  return <Outlet />
}