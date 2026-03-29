
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


const ProtectedRoute = ({ children, roles = [] }) => {
  const { estaAutenticado, perfil, cargando } = useAuth()
  const location = useLocation()

  
 if (roles.length > 0 && !roles.includes(perfil?.rol)) {
  const destino = 
    perfil?.rol === 'empleado'      ? '/canje-cupones' :
    perfil?.rol === 'admin_empresa' ? '/dashboard-empresa' :
    perfil?.rol === 'administrador' ? '/dashboard-admin' :
    '/no-autorizado'
  return <Navigate to={destino} replace />
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