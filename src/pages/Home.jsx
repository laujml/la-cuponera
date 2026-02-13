import { useState, useEffect } from 'react'
import { getOfertasActivas, getOfertasPorRubro } from '../services/ofertasService'
import OfertaCard from '../components/layout/OfertaCard'
import FiltroRubros from '../components/ofertas/FiltroRubros'
import { FiAlertCircle } from 'react-icons/fi'

const Home = () => {
  const [ofertas, setOfertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rubroSeleccionado, setRubroSeleccionado] = useState(null)

  useEffect(() => {
    cargarOfertas()
  }, [rubroSeleccionado])

  const cargarOfertas = async () => {
    setLoading(true)
    setError(null)

    try {
      let result
      if (rubroSeleccionado) {
        result = await getOfertasPorRubro(rubroSeleccionado)
      } else {
        result = await getOfertasActivas()
      }

      if (result.error) {
        setError('Error al cargar las ofertas')
      } else {
        setOfertas(result.data || [])
      }
    } catch (err) {
      setError('Error al cargar las ofertas')
    } finally {
      setLoading(false)
    }
  }

  const handleRubroChange = (rubroId) => {
    setRubroSeleccionado(rubroId)
  }

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Disfruta de los mejores cupones
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Descuentos increíbles en restaurantes, entretenimiento, belleza y más
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Título de sección */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {rubroSeleccionado ? 'Ofertas filtradas' : 'Categorías populares'}
          </h2>
          <p className="text-gray-600">
            {ofertas.length} {ofertas.length === 1 ? 'oferta disponible' : 'ofertas disponibles'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar con filtros */}
          <aside className="lg:col-span-1">
            <FiltroRubros 
              rubroSeleccionado={rubroSeleccionado}
              onRubroChange={handleRubroChange}
            />
          </aside>

          {/* Grid de ofertas */}
          <div className="lg:col-span-3">
            
            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar ofertas</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={cargarOfertas}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Intentar de nuevo
                </button>
              </div>
            )}

            {/* Sin ofertas */}
            {!loading && !error && ofertas.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <FiAlertCircle className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay ofertas disponibles
                </h3>
                <p className="text-gray-600">
                  {rubroSeleccionado 
                    ? 'No encontramos ofertas en esta categoría. Intenta con otra.'
                    : 'No hay ofertas activas en este momento.'}
                </p>
                {rubroSeleccionado && (
                  <button 
                    onClick={() => handleRubroChange(null)}
                    className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Ver todas las ofertas
                  </button>
                )}
              </div>
            )}

            {/* Grid de ofertas */}
            {!loading && !error && ofertas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ofertas.map(oferta => (
                  <OfertaCard key={oferta.id} oferta={oferta} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home