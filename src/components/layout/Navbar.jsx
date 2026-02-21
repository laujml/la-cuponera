
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiUser, FiChevronDown } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { cerrarSesion } from '../../services/authService'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [perfilOpen, setPerfilOpen] = useState(false)
  const { estaAutenticado, perfil } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setPerfilOpen(false)
    const { error } = await cerrarSesion()
    if (error) {
      toast.error('Error al cerrar sesión')
    } else {
      toast.success('Sesión cerrada')
      navigate('/')
    }
  }

  // Cerrar dropdown al hacer click fuera
  const handleClickOutside = () => {
    if (perfilOpen) setPerfilOpen(false)
  }

  return (
    <>
      {/* Overlay para cerrar dropdown */}
      {perfilOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClickOutside}
        />
      )}

      <nav className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo - Click lleva al inicio */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition">
              <img 
                src="/Cuponera-sin fondo.png" 
                alt="La Cuponera" 
                className="h-20 w-auto"
              />
            </Link>

            {/* Buscador (centro) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <input
                type="text"
                placeholder="Buscar ofertas..."
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Navegación (derecha) */}
            <div className="flex items-center space-x-6">
              
              {/* Botón Mis cupones */}
              <Link 
                to="/mis-cupones" 
                className="text-white hover:text-orange-200 transition font-medium"
              >
                Mis cupones
              </Link>

              {/* Botón Carrito */}
              <Link 
                to="/carrito" 
                className="text-white hover:text-orange-200 transition font-medium"
              >
                Carrito
              </Link>
              
              {/* Dropdown Perfil */}
              <div className="relative">
                <button 
                  onClick={() => setPerfilOpen(!perfilOpen)}
                  className="flex items-center space-x-2 text-white hover:text-orange-200 transition font-medium"
                >
                  <FiUser className="text-xl" />
                  <span>Perfil</span>
                  <FiChevronDown className={`transition-transform ${perfilOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {perfilOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    {estaAutenticado ? (
                      <>
                        {/* Header con nombre del usuario */}
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 truncate">
                            {perfil?.nombre} {perfil?.apellido}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{perfil?.email}</p>
                        </div>

                        <Link 
                          to="/perfil" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                          onClick={() => setPerfilOpen(false)}
                        >
                          Ver perfil
                        </Link>
                        <Link 
                          to="/mis-cupones" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                          onClick={() => setPerfilOpen(false)}
                        >
                          Historial de compras
                        </Link>
                        <button 
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                          onClick={handleLogout}
                        >
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                          onClick={() => setPerfilOpen(false)}
                        >
                          Iniciar sesión
                        </Link>
                        <Link 
                          to="/registro" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                          onClick={() => setPerfilOpen(false)}
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buscador Mobile */}
          <div className="md:hidden pb-3">
            <input
              type="text"
              placeholder="Buscar ofertas..."
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar