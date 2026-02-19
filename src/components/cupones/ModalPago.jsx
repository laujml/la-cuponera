// src/components/cupones/ModalPago.jsx
import { useState } from 'react'
import { FiX, FiCreditCard, FiLock, FiCheck } from 'react-icons/fi'
import { useForm } from '../../hooks/useForm'

const ModalPago = ({ oferta, onConfirmar, onCancelar, procesando }) => {
  const { valores, errores, handleChange, validar } = useForm(
    { numeroTarjeta: '', nombreTarjeta: '', vencimiento: '', cvv: '' },
    {
      numeroTarjeta: { requerido: true, minLength: 19, maxLength: 19 },
      nombreTarjeta: { requerido: true, minLength: 3 },
      vencimiento: { requerido: true, minLength: 5 },
      cvv: { requerido: true, minLength: 3, maxLength: 4 },
    }
  )

  // Auto-format card number as XXXX XXXX XXXX XXXX
  const handleCardNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim()
    handleChange({ target: { name: 'numeroTarjeta', value: formatted } })
  }

  // Auto-format MM/YY
  const handleExpiry = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    const formatted = raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw
    handleChange({ target: { name: 'vencimiento', value: formatted } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validar()) onConfirmar()
  }

  const ahorro = (oferta.precio_regular - oferta.precio_oferta).toFixed(2)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <FiLock className="text-green-500" />
            <h2 className="text-lg font-bold text-gray-800">Pago seguro</h2>
          </div>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Order summary */}
        <div className="mx-6 mt-4 bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1 font-medium">Resumen del pedido</p>
          <p className="font-semibold text-gray-800 text-sm">{oferta.titulo}</p>
          <p className="text-xs text-gray-500">{oferta.empresa_nombre}</p>
          <div className="flex justify-between items-end mt-3">
            <div>
              <span className="text-xs text-gray-400 line-through">${oferta.precio_regular.toFixed(2)}</span>
              <p className="text-xs text-green-600 font-medium">Ahorras ${ahorro}</p>
            </div>
            <p className="text-2xl font-bold text-red-600">${oferta.precio_oferta.toFixed(2)}</p>
          </div>
        </div>

        {/* Card form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Card number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de tarjeta
            </label>
            <div className="relative">
              <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="numeroTarjeta"
                value={valores.numeroTarjeta}
                onChange={handleCardNumber}
                placeholder="0000 0000 0000 0000"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 tracking-wider ${
                  errores.numeroTarjeta ? 'border-red-400' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.numeroTarjeta && (
              <p className="text-red-500 text-xs mt-1">{errores.numeroTarjeta}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre en la tarjeta
            </label>
            <input
              type="text"
              name="nombreTarjeta"
              value={valores.nombreTarjeta}
              onChange={handleChange}
              placeholder="JUAN PEREZ"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase ${
                errores.nombreTarjeta ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errores.nombreTarjeta && (
              <p className="text-red-500 text-xs mt-1">{errores.nombreTarjeta}</p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
              <input
                type="text"
                name="vencimiento"
                value={valores.vencimiento}
                onChange={handleExpiry}
                placeholder="MM/AA"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.vencimiento ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errores.vencimiento && (
                <p className="text-red-500 text-xs mt-1">{errores.vencimiento}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                name="cvv"
                value={valores.cvv}
                onChange={handleChange}
                placeholder="•••"
                maxLength={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.cvv ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errores.cvv && <p className="text-red-500 text-xs mt-1">{errores.cvv}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={procesando}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            {procesando ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Procesando...
              </>
            ) : (
              <>
                <FiCheck />
                Pagar ${oferta.precio_oferta.toFixed(2)}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            🔒 Pago simulado — No se realizará ningún cargo real
          </p>
        </form>
      </div>
    </div>
  )
}

export default ModalPago