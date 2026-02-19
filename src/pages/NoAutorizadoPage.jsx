// src/pages/NoAutorizadoPage.jsx
import { Link } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'

const NoAutorizadoPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <FiLock className="text-red-500 text-4xl" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso denegado</h1>
      <p className="text-gray-600 mb-8">
        No tienes permisos para ver esta página.
      </p>
      <Link
        to="/"
        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        Volver al inicio
      </Link>
    </div>
  </div>
)

export default NoAutorizadoPage