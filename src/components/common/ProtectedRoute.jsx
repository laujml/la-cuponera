// src/components/common/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Wraps a route and enforces authentication + optional role check.
 *
 * Usage:
 *   <ProtectedRoute>                          // any logged-in user
 *   <ProtectedRoute roles={['administrador']} // only admins
 *   <ProtectedRoute roles={['cliente', 'administrador']} // clients or admins
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { estaAutenticado, perfil, cargando } = useAuth()
  const location = useLocation()

  // Still loading session — show nothing (spinner handled at layout level)
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    )
  }

  // Not authenticated → send to login, preserving intended destination
  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role check — if roles array is empty, any authenticated user is allowed
  if (roles.length > 0 && !roles.includes(perfil?.rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return children
}

export default ProtectedRoute