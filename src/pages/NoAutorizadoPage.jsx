
import { Link } from 'react-router-dom'
import { FiAlertTriangle, FiHome } from 'react-icons/fi'

const NoAutorizadoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="text-red-500 text-5xl" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso denegado</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          No tienes permisos para acceder a esta página. Si crees que esto es un error, 
          contacta al administrador.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          <FiHome />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NoAutorizadoPage