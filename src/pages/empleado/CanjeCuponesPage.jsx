import { useState } from 'react'
import { getCuponPorCodigo, canjearCupon } from '../../services/empleadoService'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../config/supabaseClient'

const ESTADO = {
  IDLE:     'idle',
  LOADING:  'loading',
  HALLADO:  'hallado',
  CANJEADO: 'canjeado',
  ERROR:    'error',
}

export default function CanjeCuponesPage() {
  const { perfil } = useAuth()

  const [codigo, setCodigo]     = useState('')
  const [dui, setDui]           = useState('')
  const [estado, setEstado]     = useState(ESTADO.IDLE)
  const [errorMsg, setErrorMsg] = useState('')
  const [cupon, setCupon]       = useState(null)
  const [cliente, setCliente]   = useState(null)

  const handleBuscar = async () => {
    if (!codigo.trim()) {
      setErrorMsg('Ingresa el código del cupón.')
      setEstado(ESTADO.ERROR)
      return
    }

     const formatoCupon = /^[A-Z0-9]+-[A-Z0-9]+$/
  if (!formatoCupon.test(codigo.trim())) {
    setErrorMsg('El formato del código no es válido. Ejemplo: CUP-944AFC7E')
    setEstado(ESTADO.ERROR)
    return
  }

    setEstado(ESTADO.LOADING)
    setErrorMsg('')
    setCupon(null)
    setCliente(null)

    const { data, error } = await getCuponPorCodigo(codigo)

    if (error || !data) {
      setErrorMsg('El código de cupón no existe o es inválido.')
      setEstado(ESTADO.ERROR)
      return
    }

    // Buscar datos del cliente
    const { data: clienteData } = await supabase
      .from('clientes')
      .select('nombres, apellidos, dui, telefono')
      .eq('id', data.cliente_id)
      .single()

    setCupon(data)
    setCliente(clienteData)
    setEstado(ESTADO.HALLADO)
  }

  const handleCanjear = async () => {
    if (!dui.trim()) {
      setErrorMsg('Ingresa el DUI del cliente.')
      setEstado(ESTADO.ERROR)
      return
    }

    setEstado(ESTADO.LOADING)
    setErrorMsg('')

    const { data, error } = await canjearCupon(codigo, dui)

    if (error) {
      setErrorMsg(typeof error === 'string' ? error : 'Error al procesar el canje.')
      setEstado(ESTADO.ERROR)
      return
    }

    setCupon(data)
    setEstado(ESTADO.CANJEADO)
  }

  const handleReset = () => {
    setCodigo('')
    setDui('')
    setEstado(ESTADO.IDLE)
    setErrorMsg('')
    setCupon(null)
    setCliente(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div
        className="text-white py-7 px-6 shadow"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black">Canje de cupones</h1>
          <p className="text-orange-100 text-sm mt-0.5">Bienvenido, {perfil?.nombre}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div
            className="px-6 py-4 border-b border-gray-100"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            <h2 className="text-white font-black text-lg text-center">Validar y canjear cupón</h2>
          </div>

          <div className="p-6">

            {/* Código del cupón + botón buscar */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                Código del cupón
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                  placeholder="Ej: ELB-0012345"
                  disabled={estado === ESTADO.LOADING || estado === ESTADO.HALLADO || estado === ESTADO.CANJEADO}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 disabled:opacity-50 transition"
                />
                <button
                  onClick={handleBuscar}
                  disabled={estado === ESTADO.LOADING || estado === ESTADO.HALLADO || estado === ESTADO.CANJEADO}
                  className="px-5 py-2.5 text-sm text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                  {estado === ESTADO.LOADING ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>

            {/* Info del cupón y cliente */}
            {(estado === ESTADO.HALLADO || estado === ESTADO.CANJEADO) && cupon && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Informacion del cupon
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 space-y-1">
                    <p><span className="font-bold">Oferta:</span> {cupon.oferta?.titulo}</p>
                    <p><span className="font-bold">Precio pagado:</span> ${cupon.precio_pagado}</p>
                    <p><span className="font-bold">Vencimiento:</span> {cupon.fecha_vencimiento}</p>
                    <p><span className="font-bold">Estado:</span> {cupon.estado}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Informacion del comprador
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 space-y-1">
                    {cliente ? (
                      <>
                        <p><span className="font-bold">Nombre:</span> {cliente.nombres} {cliente.apellidos}</p>
                        <p><span className="font-bold">DUI:</span> {cliente.dui}</p>
                        <p><span className="font-bold">Telefono:</span> {cliente.telefono}</p>
                      </>
                    ) : (
                      <p className="text-gray-400">No se encontraron datos del cliente</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DUI del cliente que presenta el cupón */}
            {estado === ESTADO.HALLADO && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                  DUI del cliente que presenta el cupon
                </label>
                <input
                  type="text"
                  value={dui}
                  onChange={e => setDui(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCanjear()}
                  placeholder="00000000-0"
                  className="w-full sm:w-64 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition"
                />
              </div>
            )}

            {/* Exito */}
            {estado === ESTADO.CANJEADO && (
              <div
                className="rounded-xl px-6 py-5 mb-6 text-center"
                style={{ background: 'linear-gradient(135deg, #15803d, #166534)' }}
              >
                <p className="text-white font-black text-lg">Cupon canjeado con exito</p>
                <p className="text-green-200 text-sm mt-1">{cupon?.oferta?.titulo}</p>
              </div>
            )}

            {/* Error */}
            {estado === ESTADO.ERROR && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
                <p className="text-red-700 font-semibold text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3">
              {estado === ESTADO.CANJEADO ? (
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-sm text-white font-bold rounded-full hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                >
                  Canjear otro cupon
                </button>
              ) : estado === ESTADO.HALLADO ? (
                <>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 text-sm border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCanjear}
                    disabled={estado === ESTADO.LOADING}
                    className="px-6 py-2.5 text-sm text-white font-bold rounded-full hover:opacity-90 transition disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                  >
                    Canjear cupon
                  </button>
                </>
              ) : estado === ESTADO.ERROR ? (
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-sm border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition font-medium"
                >
                  Intentar de nuevo
                </button>
              ) : null}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}