import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiTag } from 'react-icons/fi'

const OfertaCard = ({ oferta }) => {
  // Calcular días restantes
  const calcularDiasRestantes = () => {
    const hoy = new Date()
    const fechaFin = new Date(oferta.fecha_fin)
    const diferencia = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24))
    return diferencia
  }

  const diasRestantes = calcularDiasRestantes()

  return (
    <Link to={`/ofertas/${oferta.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        
        {/* Imagen de la oferta */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={oferta.imagen_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen'} 
            alt={oferta.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badge de descuento */}
<div className="absolute top-3 right-3 bg-red-600 text-white px-4 py-2 font-bold shadow-lg border-4 border-white rounded-lg transform -rotate-6">
  {oferta.porcentaje_descuento}% OFF
</div>

          {/* Badge de cupones limitados */}
          {oferta.cantidad_limite && oferta.cupones_disponibles < 20 && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Solo {oferta.cupones_disponibles} cupones
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="p-4">
          
          {/* Categoría y empresa */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-1 rounded">
              {oferta.rubro_nombre}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <FiMapPin className="mr-1" />
              <span className="truncate max-w-[120px]">{oferta.empresa_nombre}</span>
            </div>
          </div>

          {/* Título de la oferta */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
            {oferta.titulo}
          </h3>

          {/* Descripción breve */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {oferta.descripcion}
          </p>

          {/* Precios */}
          <div className="flex items-end space-x-2 mb-3">
            <span className="text-2xl font-bold text-red-600">
              ${oferta.precio_oferta.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through mb-1">
              ${oferta.precio_regular.toFixed(2)}
            </span>
          </div>

          {/* Información adicional */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>
                {diasRestantes > 0 
                  ? `${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'} restantes`
                  : 'Último día'
                }
              </span>
            </div>
            <div className="flex items-center">
              <FiTag className="mr-1" />
              <span>Válido hasta {new Date(oferta.fecha_limite_uso).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Botón de compra */}
          <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
            Ver Oferta
          </button>
        </div>
      </div>
    </Link>
  )
}

export default OfertaCard