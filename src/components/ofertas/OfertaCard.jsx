// src/components/ofertas/OfertaCard.jsx
import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiTag } from 'react-icons/fi'

const OfertaCard = ({ oferta }) => {
  const calcularDiasRestantes = () => {
    const hoy = new Date()
    const fechaFin = new Date(oferta.fecha_fin)
    const diferencia = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24))
    return diferencia
  }

  const diasRestantes = calcularDiasRestantes()
  const ahorro = (oferta.precio_regular - oferta.precio_oferta).toFixed(2)
  const pocosDisponibles = oferta.cantidad_limite && oferta.cupones_disponibles < 10

  return (
    <Link 
      to={`/ofertas/${oferta.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={oferta.imagen_url || 'https://via.placeholder.com/400x300?text=Oferta'}
          alt={oferta.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge de descuento */}
        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
          {oferta.porcentaje_descuento}% OFF
        </div>

        {/* Badge de categoría */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {oferta.rubro_nombre}
        </div>

        {/* Overlay de urgencia */}
        {(diasRestantes <= 3 || pocosDisponibles) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-xs font-semibold flex items-center gap-1">
              {diasRestantes <= 3 && <><FiClock /> ¡Últimos {diasRestantes} días!</>}
              {pocosDisponibles && !diasRestantes <= 3 && <><FiTag /> ¡Solo quedan {oferta.cupones_disponibles}!</>}
            </p>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Empresa */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <FiMapPin className="text-orange-400" />
          <span className="truncate">{oferta.empresa_nombre}</span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {oferta.titulo}
        </h3>

        {/* Precios */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 line-through">
              ${oferta.precio_regular.toFixed(2)}
            </p>
            <p className="text-xl font-bold text-red-600">
              ${oferta.precio_oferta.toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
            Ahorras ${ahorro}
          </p>
        </div>

        {/* Stock disponible */}
        {oferta.cantidad_limite && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Disponibles:</span>
              <span className={`font-semibold ${
                oferta.cupones_disponibles < 10 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {oferta.cupones_disponibles} cupones
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  oferta.cupones_disponibles < 10 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.min(100, (oferta.cupones_disponibles / oferta.cantidad_limite) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default OfertaCard