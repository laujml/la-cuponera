// src/components/ofertas/FiltroRubros.jsx
import { useState, useEffect } from 'react'
import { getRubros } from '../../services/ofertasService'
import { FiGrid } from 'react-icons/fi'

const FiltroRubros = ({ rubroActivo, onSeleccionar }) => {
  const [rubros, setRubros] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarRubros()
  }, [])

  const cargarRubros = async () => {
    const { data } = await getRubros()
    setRubros(data || [])
    setCargando(false)
  }

  if (cargando) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* Botón "Todos" */}
      <button
        onClick={() => onSeleccionar(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
          rubroActivo === null
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
        }`}
      >
        <FiGrid className="text-base" />
        Todos
      </button>

      {/* Botones de rubros */}
      {rubros.map((rubro) => (
        <button
          key={rubro.id}
          onClick={() => onSeleccionar(rubro.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
            rubroActivo === rubro.id
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
          }`}
        >
          {rubro.nombre}
        </button>
      ))}
    </div>
  )
}

export default FiltroRubros