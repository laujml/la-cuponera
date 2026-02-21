// src/components/cupones/CuponCard.jsx
import { FiCalendar, FiMapPin, FiDownload, FiCheckCircle, FiClock } from 'react-icons/fi'
import { generarPDFCupon } from '../../utils/pdfCupon'

const ESTADO_CONFIG = {
  disponible: {
    label: 'Disponible',
    clase: 'bg-green-100 text-green-700',
    icono: <FiCheckCircle className="text-green-500" />,
  },
  canjeado: {
    label: 'Canjeado',
    clase: 'bg-gray-100 text-gray-600',
    icono: <FiCheckCircle className="text-gray-400" />,
  },
  vencido: {
    label: 'Vencido',
    clase: 'bg-red-100 text-red-600',
    icono: <FiClock className="text-red-400" />,
  },
}

const CuponCard = ({ cupon }) => {
  const oferta = cupon.oferta
  const config = ESTADO_CONFIG[cupon.estado] || ESTADO_CONFIG.disponible
  const estaActivo = cupon.estado === 'disponible'

  const handleDescargar = () => {
    generarPDFCupon(cupon)
  }

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden border transition-all hover:shadow-lg ${
      estaActivo ? 'border-green-200' : 'border-gray-200 opacity-80'
    }`}>
      
      {/* Coupon top – image + discount badge */}
      <div className="relative h-36 bg-gray-100">
        <img
          src={oferta?.imagen_url || 'https://via.placeholder.com/400x200?text=Cupón'}
          alt={oferta?.titulo}
          className="w-full h-full object-cover"
        />
        {/* Discount ribbon */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
          {oferta?.porcentaje_descuento}% OFF
        </div>
        {/* Status badge */}
        <div className={`absolute top-2 right-2 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shadow ${config.clase}`}>
          {config.icono}
          {config.label}
        </div>
      </div>

      {/* Coupon bottom – perforated line effect */}
      <div className="relative">
        <div className="absolute -top-3 left-0 right-0 flex justify-between px-2">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-50 rounded-full border border-gray-200" />
          ))}
        </div>
      </div>

      <div className="p-4 pt-5">
        {/* Offer title */}
        <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
          {oferta?.titulo}
        </h3>

        {/* Company */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <FiMapPin className="text-orange-400 flex-shrink-0" />
          <span className="truncate">{oferta?.empresa_nombre}</span>
        </div>

        {/* Coupon code */}
        <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3 text-center border border-dashed border-gray-300">
          <p className="text-xs text-gray-500 mb-0.5">Código del cupón</p>
          <p className="text-lg font-bold tracking-widest text-orange-600 font-mono">
            {cupon.codigo}
          </p>
        </div>

        {/* Price + expiry */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div>
            <span className="line-through text-gray-400">${oferta?.precio_regular?.toFixed(2)}</span>
            <span className="ml-2 font-bold text-green-600 text-sm">
              ${cupon.precio_pagado?.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="text-orange-400" />
            <span>
              {new Date(cupon.fecha_vencimiento).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
        </div>

        {/* Download button — only for active coupons */}
        {estaActivo && (
          <button
            onClick={handleDescargar}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-orange-600 transition shadow-sm"
          >
            <FiDownload />
            Descargar cupón
          </button>
        )}

        {cupon.estado === 'canjeado' && cupon.fecha_canje && (
          <div className="text-center py-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              ✓ Canjeado el{' '}
              {new Date(cupon.fecha_canje).toLocaleDateString('es-ES')}
            </p>
          </div>
        )}

        {cupon.estado === 'vencido' && (
          <div className="text-center py-2 bg-red-50 rounded-lg">
            <p className="text-xs text-red-500">
              Este cupón ha expirado
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CuponCard