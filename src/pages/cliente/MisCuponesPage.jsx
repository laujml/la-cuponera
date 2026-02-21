// src/pages/cliente/MisCuponesPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMisCupones, categorizarCupones } from '../../services/cuponesService'
import CuponCard from '../../components/cupones/CuponCard'
import { FiTag, FiCheckCircle, FiClock, FiAlertCircle, FiShoppingBag } from 'react-icons/fi'

const TABS = [
  { key: 'disponibles', label: 'Disponibles', icono: <FiTag />, color: 'text-green-600' },
  { key: 'canjeados',   label: 'Canjeados',   icono: <FiCheckCircle />, color: 'text-gray-500' },
  { key: 'vencidos',    label: 'Vencidos',    icono: <FiClock />, color: 'text-red-500' },
]

const MisCuponesPage = () => {
  const [categorias, setCategorias] = useState({ disponibles: [], canjeados: [], vencidos: [] })
  const [tabActiva, setTabActiva] = useState('disponibles')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarCupones()
  }, [])

  const cargarCupones = async () => {
    setCargando(true)
    setError(null)
    
    const { data, error: err } = await getMisCupones()
    
    if (err) {
      setError('No se pudieron cargar tus cupones.')
    } else {
      setCategorias(categorizarCupones(data || []))
    }
    setCargando(false)
  }

  const cuponesActuales = categorias[tabActiva] || []
  const totalCupones = Object.values(categorias).flat().length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiShoppingBag className="text-orange-500" />
            Mis cupones
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalCupones === 0
              ? 'Aún no tienes cupones. ¡Compra uno!'
              : `${totalCupones} ${totalCupones === 1 ? 'cupón' : 'cupones'} en total`}
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm w-fit">
          {TABS.map((tab) => {
            const count = categorias[tab.key].length
            const activa = tabActiva === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setTabActiva(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activa
                    ? 'bg-orange-500 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icono}
                <span className="hidden sm:inline">{tab.label}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activa ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {cargando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="h-36 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={cargarCupones}
              className="mt-4 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Empty state */}
        {!cargando && !error && cuponesActuales.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">
              {tabActiva === 'disponibles' && '🎟️'}
              {tabActiva === 'canjeados' && '✅'}
              {tabActiva === 'vencidos' && '⏰'}
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {tabActiva === 'disponibles' && 'No tienes cupones disponibles'}
              {tabActiva === 'canjeados' && 'No has canjeado ningún cupón'}
              {tabActiva === 'vencidos' && 'No tienes cupones vencidos'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {tabActiva === 'disponibles'
                ? 'Explora las ofertas y compra tu primer cupón.'
                : tabActiva === 'canjeados'
                  ? 'Cuando canjees un cupón, aparecerá aquí.'
                  : 'Los cupones que expiren aparecerán en esta sección.'}
            </p>
            {tabActiva === 'disponibles' && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-medium"
              >
                <FiTag />
                Ver ofertas
              </Link>
            )}
          </div>
        )}

        {/* Coupons grid */}
        {!cargando && !error && cuponesActuales.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cuponesActuales.map((cupon) => (
              <CuponCard key={cupon.id} cupon={cupon} />
            ))}
          </div>
        )}

        {/* Refresh button */}
        {!cargando && !error && totalCupones > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={cargarCupones}
              className="text-sm text-gray-500 hover:text-orange-600 transition"
            >
              ↻ Actualizar cupones
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MisCuponesPage