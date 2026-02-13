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
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
<div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white py-20 overflow-hidden">
  {/* Patrón de fondo */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}></div>
  </div>

  {/* Formas decorativas */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>

  {/* Contenido */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
      Descuentos de hasta 70% OFF
    </div>
    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
      Disfruta de los mejores cupones
    </h1>
    <p className="text-xl md:text-2xl opacity-95 max-w-2xl mx-auto">
      Descuentos increíbles en restaurantes, entretenimiento, belleza y más
    </p>
    
    {/* Botón CTA */}
    <button 
  onClick={() => {
    document.getElementById('ofertas-section').scrollIntoView({ 
      behavior: 'smooth' 
    })
  }}
  className="mt-8 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
>
  Explorar ofertas
</button>
  </div>
</div>

      <div 
  id="ofertas-section" 
  className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.04'%3E%3Crect x='20' y='30' width='60' height='40' rx='4'/%3E%3Ccircle cx='20' cy='50' r='6'/%3E%3Ccircle cx='80' cy='50' r='6'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundColor: '#F9FAFB'
  }}
>
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