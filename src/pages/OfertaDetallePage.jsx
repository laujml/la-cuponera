import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOfertaPorId } from '../services/ofertasService'
import { 
  FiMapPin, FiClock, FiTag, FiCalendar, 
  FiShoppingCart, FiArrowLeft, FiAlertCircle 
} from 'react-icons/fi'

const OfertaDetallePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [oferta, setOferta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarOferta()
  }, [id])

  const cargarOferta = async () => {
    setLoading(true)
    setError(null)

    const { data, error: err } = await getOfertaPorId(id)
    
    if (err || !data) {
      setError('No se pudo cargar la oferta')
    } else {
      setOferta(data)
    }
    
    setLoading(false)
  }

  const calcularDiasRestantes = () => {
    if (!oferta) return 0
    const hoy = new Date()
    const fechaFin = new Date(oferta.fecha_fin)
    const diferencia = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24))
    return diferencia
  }

  const handleComprar = () => {
    console.log('Comprar oferta:', oferta.id)
    alert('Función de compra pendiente - Persona 2 la implementará')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !oferta) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Oferta no encontrada</h2>
            <p className="text-red-600 mb-6">La oferta que buscas no existe o ya no está disponible.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  const diasRestantes = calcularDiasRestantes()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Botón volver */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-orange-600 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna izquierda - Imagen y detalles */}
          <div className="lg:col-span-2">
            
            {/* Imagen principal */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-96">
                <img 
                  src={oferta.imagen_url || 'https://via.placeholder.com/800x600?text=Sin+Imagen'} 
                  alt={oferta.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  {oferta.porcentaje_descuento}% OFF
                </div>
              </div>
            </div>

            {/* Información detallada */}
            <div className="bg-white rounded-lg shadow-md p-6">
              
              {/* Categoría */}
              <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {oferta.rubro_nombre}
              </span>

              {/* Título */}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {oferta.titulo}
              </h1>

              {/* Empresa */}
              <div className="flex items-center text-gray-600 mb-6">
                <FiMapPin className="mr-2 text-orange-600" />
                <span className="font-medium">{oferta.empresa_nombre}</span>
                {oferta.empresa_direccion && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{oferta.empresa_direccion}</span>
                  </>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {oferta.descripcion}
                </p>
              </div>

              {/* Otros detalles */}
              {oferta.otros_detalles && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Información importante:</h3>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {oferta.otros_detalles}
                  </p>
                </div>
              )}

              {/* Fechas importantes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Oferta válida hasta</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(oferta.fecha_fin).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiTag className="text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Cupón válido hasta</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(oferta.fecha_limite_uso).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiClock className="text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Tiempo restante</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {diasRestantes > 0 
                        ? `${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}`
                        : 'Último día'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              
              {/* Precios */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Precio regular:</p>
                <p className="text-2xl text-gray-400 line-through mb-3">
                  ${oferta.precio_regular.toFixed(2)}
                </p>
                
                <p className="text-sm text-gray-600 mb-1">Precio con cupón:</p>
                <p className="text-4xl font-bold text-red-600 mb-2">
                  ${oferta.precio_oferta.toFixed(2)}
                </p>
                
                <p className="text-sm text-green-600 font-semibold">
                  Ahorras ${(oferta.precio_regular - oferta.precio_oferta).toFixed(2)}
                </p>
              </div>

              {/* Disponibilidad */}
              {oferta.cantidad_limite && (
                <div className="mb-6 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-orange-700">
                      {oferta.cupones_disponibles}
                    </span> cupones disponibles
                  </p>
                  {oferta.cupones_disponibles < 20 && (
                    <p className="text-xs text-orange-600 mt-1">Quedan pocos</p>
                  )}
                </div>
              )}

              {/* Botón de compra */}
              <button 
                onClick={handleComprar}
                disabled={oferta.cupones_disponibles === 0}
                className={`w-full py-3 rounded-lg font-bold text-lg transition flex items-center justify-center space-x-2 ${
                  oferta.cupones_disponibles === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <FiShoppingCart />
                <span>
                  {oferta.cupones_disponibles === 0 ? 'Agotado' : 'Comprar cupón'}
                </span>
              </button>

              {/* Información adicional */}
              <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                <p className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Confirmación inmediata
                </p>
                <p className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Cupón digital descargable
                </p>
                <p className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Canjeable en el establecimiento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfertaDetallePage