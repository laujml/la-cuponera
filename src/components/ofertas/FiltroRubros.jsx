import { useEffect, useState } from 'react'
import { getRubros } from '../../services/ofertasService'
import { FiFilter } from 'react-icons/fi'

const FiltroRubros = ({ rubroSeleccionado, onRubroChange }) => {
  const [rubros, setRubros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarRubros()
  }, [])

  const cargarRubros = async () => {
    const { data, error } = await getRubros()
    if (!error && data) {
      setRubros(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      
      {/* Título */}
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b">
        <FiFilter className="text-orange-600 text-xl" />
        <h3 className="text-lg font-bold text-gray-800">Categorías</h3>
      </div>

      {/* Botón "Todas" */}
      <button
        onClick={() => onRubroChange(null)}
        className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
          rubroSeleccionado === null
            ? 'bg-orange-500 text-white font-semibold'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        Todas las ofertas
      </button>

      {/* Lista de rubros */}
      <div className="space-y-2">
        {rubros.map(rubro => (
          <button
            key={rubro.id}
            onClick={() => onRubroChange(rubro.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              rubroSeleccionado === rubro.id
                ? 'bg-orange-500 text-white font-semibold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {rubro.nombre}
          </button>
        ))}
      </div>

      {/* Info adicional */}
      {rubroSeleccionado && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => onRubroChange(null)}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Limpiar filtro
          </button>
        </div>
      )}
    </div>
  )
}

export default FiltroRubros