
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


const ProtectedRoute = ({ children, roles = [] }) => {
  const { estaAutenticado, perfil, cargando } = useAuth()
  const location = useLocation()

  
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    )
  }

  
  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  
  if (roles.length > 0 && !roles.includes(perfil?.rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return children
}

export default ProtectedRoute