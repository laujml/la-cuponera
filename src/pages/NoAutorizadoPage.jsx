import { useNavigate } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const NoAutorizadoPage = () => {
  const navigate = useNavigate()
  const { perfil } = useAuth()

  const handleVolver = () => {
    if (perfil?.rol === 'empleado')      navigate('/canje-cupones')
    else if (perfil?.rol === 'admin_empresa') navigate('/dashboard-empresa')
    else if (perfil?.rol === 'administrador') navigate('/dashboard-admin')
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="text-red-500 text-5xl" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso denegado</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          No tienes permisos para acceder a esta pagina. Si crees que esto es un error,
          contacta al administrador.
        </p>

        <button
          onClick={handleVolver}
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default NoAutorizadoPage