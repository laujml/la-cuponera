
import { useState, useEffect } from 'react'
import { getOfertasActivas, getOfertasPorRubro } from '../services/ofertasService'
import OfertaCard from '../components/ofertas/OfertaCard'
import FiltroRubros from '../components/ofertas/FiltroRubros'
import { FiTag, FiAlertCircle } from 'react-icons/fi'

const Home = () => {
  const [ofertas, setOfertas] = useState([])
  const [rubroActivo, setRubroActivo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarOfertas()
  }, [rubroActivo])

  const cargarOfertas = async () => {
    setCargando(true)
    setError(null)

    const { data, error: err } = rubroActivo
      ? await getOfertasPorRubro(rubroActivo)
      : await getOfertasActivas()

    if (err) {
      setError('No se pudieron cargar las ofertas')
    } else {
      setOfertas(data || [])
    }
    setCargando(false)
  }

  const handleSeleccionarRubro = (rubroId) => {
    setRubroActivo(rubroId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¡Ofertas increíbles te esperan!
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto">
            Descubre los mejores descuentos en restaurantes, spa, entretenimiento y más en El Salvador.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header + filtros */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FiTag className="text-orange-500" />
              Ofertas del día
            </h2>
            <span className="text-sm text-gray-500">
              {ofertas.length} {ofertas.length === 1 ? 'oferta' : 'ofertas'} disponibles
            </span>
          </div>
          
          {/* Filtro de rubros */}
          <FiltroRubros 
            rubroActivo={rubroActivo} 
            onSeleccionar={handleSeleccionarRubro} 
          />
        </div>

        {/* Loading state */}
        {cargando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !cargando && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={cargarOfertas}
              className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Empty state */}
        {!cargando && !error && ofertas.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay ofertas disponibles
            </h3>
            <p className="text-gray-500">
              {rubroActivo 
                ? 'No encontramos ofertas en esta categoría. Prueba con otra.'
                : 'Vuelve pronto para ver nuevas ofertas increíbles.'}
            </p>
            {rubroActivo && (
              <button
                onClick={() => setRubroActivo(null)}
                className="mt-4 text-orange-600 hover:underline font-medium"
              >
                Ver todas las ofertas
              </button>
            )}
          </div>
        )}

        {/* Ofertas grid */}
        {!cargando && !error && ofertas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ofertas.map((oferta) => (
              <OfertaCard key={oferta.id} oferta={oferta} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home