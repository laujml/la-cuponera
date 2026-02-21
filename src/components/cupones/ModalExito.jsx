
import { FiCheckCircle, FiDownload, FiShoppingBag, FiX } from 'react-icons/fi'
import { generarPDFCupon } from '../../utils/pdfCupon'

const ModalExito = ({ cupon, oferta, onCerrar, onVerCupones }) => {
  
  const handleDescargar = () => {
    const cuponParaPDF = {
      ...cupon,
      oferta: {
        titulo: oferta.titulo,
        imagen_url: oferta.imagen_url,
        empresa_nombre: oferta.empresa_nombre,
        precio_regular: oferta.precio_regular,
        porcentaje_descuento: oferta.porcentaje_descuento,
        otros_detalles: oferta.otros_detalles,
      }
    }
    generarPDFCupon(cuponParaPDF)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scale-in_0.3s_ease-out]">
        
        {/* Header verde de éxito */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center text-white relative">
          <button 
            onClick={onCerrar}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <FiX className="text-xl" />
          </button>
          
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
          
          <h2 className="text-2xl font-bold mb-1">¡Compra exitosa!</h2>
          <p className="text-green-100">Tu cupón ha sido generado</p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          
          {/* Info de la oferta */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">{oferta.empresa_nombre}</p>
            <p className="font-semibold text-gray-800 line-clamp-2">{oferta.titulo}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">Total pagado:</span>
              <span className="text-xl font-bold text-green-600">
                ${cupon.precio_pagado?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Código del cupón */}
          <div className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-4 text-center mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Código de tu cupón
            </p>
            <p className="text-2xl font-bold text-orange-600 font-mono tracking-widest">
              {cupon.codigo}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Válido hasta {new Date(cupon.fecha_vencimiento).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>📋 Para canjear:</strong> Presenta este código junto con tu DUI en el establecimiento.
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={handleDescargar}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              <FiDownload />
              Descargar cupón PDF
            </button>
            
            <button
              onClick={onVerCupones}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              <FiShoppingBag />
              Ver mis cupones
            </button>
          </div>

          {/* Nota */}
          <p className="text-center text-xs text-gray-400 mt-4">
            También hemos enviado los detalles a tu correo electrónico
          </p>
        </div>
      </div>
    </div>
  )
}

export default ModalExito