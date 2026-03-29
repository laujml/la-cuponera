import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getOfertaPorId, actualizarOferta, descartarOferta } from '../../services/empresaService'
import { getRubros } from '../../services/ofertasService'

export default function EditarOfertaPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const esDescartar = searchParams.get('descartar') === 'true'

  const [form, setForm] = useState(null)
  const [rubros, setRubros] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      const [resOferta, resRubros] = await Promise.all([
        getOfertaPorId(id),
        getRubros(),
      ])

      if (resOferta.error || !resOferta.data) {
        toast.error('No se pudo cargar la oferta')
        navigate('/dashboard-empresa')
        return
      }

      if (resRubros.data) setRubros(resRubros.data)

      const o = resOferta.data
      setForm({
        titulo:           o.titulo ?? '',
        descripcion:      o.descripcion ?? '',
        otros_detalles:   o.otros_detalles ?? '',
        precio_regular:   o.precio_regular ?? '',
        precio_oferta:    o.precio_oferta ?? '',
        fecha_inicio:     o.fecha_inicio ?? '',
        fecha_fin:        o.fecha_fin ?? '',
        fecha_limite_uso: o.fecha_limite_uso ?? '',
        cantidad_limite:  o.cantidad_limite ?? '',
        imagen_url:       o.imagen_url ?? '',
        rubro_id:         o.rubro_id ?? '',
      })

      // Si viene con ?descartar=true, descartar directo
      if (esDescartar) {
        const { error } = await descartarOferta(Number(id))
        if (error) {
          toast.error('Error al descartar la oferta')
        } else {
          toast.success('Oferta descartada')
          navigate('/dashboard-empresa')
        }
        return
      }

      setCargando(false)
    }
    cargar()
  }, [id])

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))

  const descuento = form?.precio_regular && form?.precio_oferta
    ? Math.round(((form.precio_regular - form.precio_oferta) / form.precio_regular) * 100)
    : null

  const validar = () => {
    if (!form.titulo.trim())      { toast.error('El título es obligatorio');           return false }
    if (!form.rubro_id)           { toast.error('El rubro es obligatorio');            return false }
    if (!form.descripcion.trim()) { toast.error('La descripción es obligatoria');      return false }
    if (!form.precio_regular)     { toast.error('El precio regular es obligatorio');   return false }
    if (!form.precio_oferta)      { toast.error('El precio de oferta es obligatorio'); return false }
    if (Number(form.precio_oferta) >= Number(form.precio_regular)) {
      toast.error('El precio de oferta debe ser menor al precio regular')
      return false
    }
    if (!form.fecha_inicio) { toast.error('La fecha de inicio es obligatoria'); return false }
    if (!form.fecha_fin)    { toast.error('La fecha de fin es obligatoria');    return false }
    if (form.fecha_fin < form.fecha_inicio) {
      toast.error('La fecha de fin no puede ser antes de la fecha de inicio')
      return false
    }
    if (!form.cantidad_limite) { toast.error('La cantidad límite es obligatoria'); return false }
    if (Number(form.cantidad_limite) <= 0) {
      toast.error('La cantidad límite debe ser mayor a 0')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validar()) return

    setGuardando(true)
    const { error } = await actualizarOferta(Number(id), {
      ...form,
      precio_regular:   Number(form.precio_regular),
      precio_oferta:    Number(form.precio_oferta),
      cantidad_limite:  Number(form.cantidad_limite),
      fecha_limite_uso: form.fecha_limite_uso || form.fecha_fin,
      rubro_id:         Number(form.rubro_id),
    })

    if (error) {
      toast.error('Error al actualizar la oferta')
      console.error(error)
    } else {
      toast.success('Oferta reenviada para aprobación')
      navigate('/dashboard-empresa')
    }
    setGuardando(false)
  }

  if (cargando || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div
        className="text-white py-7 px-6 shadow"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard-empresa')}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm transition"
          >
            Volver
          </button>
          <div>
            <h1 className="text-2xl font-black">Editar oferta</h1>
            <p className="text-orange-100 text-sm mt-0.5">
              Al guardar, la oferta volverá a estado "En espera de aprobación"
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="md:col-span-2">
              <Campo label="Nombre de la oferta *">
                <input
                  className={inputCls}
                  value={form.titulo}
                  onChange={e => set('titulo', e.target.value)}
                  placeholder="Ej: Parrillada para 4 personas"
                />
              </Campo>
            </div>

            <div className="md:col-span-2">
              <Campo label="Rubro *">
                <select
                  className={inputCls}
                  value={form.rubro_id}
                  onChange={e => set('rubro_id', e.target.value)}
                >
                  <option value="">Selecciona un rubro...</option>
                  {rubros.map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </Campo>
            </div>

            <div className="md:col-span-2">
              <Campo label="Descripcion *">
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  value={form.descripcion}
                  onChange={e => set('descripcion', e.target.value)}
                  placeholder="Describe los detalles principales de la oferta..."
                />
              </Campo>
            </div>

            <div className="md:col-span-2">
              <Campo label="Otros detalles">
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={2}
                  value={form.otros_detalles}
                  onChange={e => set('otros_detalles', e.target.value)}
                  placeholder="Condiciones, restricciones, etc. (opcional)"
                />
              </Campo>
            </div>

            <Campo label="Precio regular ($) *">
              <input
                type="number" min="0" step="0.01"
                className={inputCls}
                value={form.precio_regular}
                onChange={e => set('precio_regular', e.target.value)}
                placeholder="0.00"
              />
            </Campo>

            <Campo label="Precio de oferta ($) *">
              <div className="relative">
                <input
                  type="number" min="0" step="0.01"
                  className={inputCls}
                  value={form.precio_oferta}
                  onChange={e => set('precio_oferta', e.target.value)}
                  placeholder="0.00"
                />
                {descuento !== null && descuento > 0 && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                  >
                    {descuento}% OFF
                  </span>
                )}
              </div>
            </Campo>

            <Campo label="Fecha de inicio *">
              <input type="date" className={inputCls} value={form.fecha_inicio}
                onChange={e => set('fecha_inicio', e.target.value)} />
            </Campo>

            <Campo label="Fecha de fin *">
              <input type="date" className={inputCls} value={form.fecha_fin}
                onChange={e => set('fecha_fin', e.target.value)} />
            </Campo>

            <Campo label="Fecha limite de uso">
              <input type="date" className={inputCls} value={form.fecha_limite_uso}
                onChange={e => set('fecha_limite_uso', e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Si no se indica, se usara la fecha de fin</p>
            </Campo>

            <Campo label="Cantidad limite de cupones *">
              <input
                type="number" min="1"
                className={inputCls}
                value={form.cantidad_limite}
                onChange={e => set('cantidad_limite', e.target.value)}
                placeholder="Ej: 100"
              />
            </Campo>

            <div className="md:col-span-2">
              <Campo label="URL de imagen">
                <input
                  className={inputCls}
                  value={form.imagen_url}
                  onChange={e => set('imagen_url', e.target.value)}
                  placeholder="https://... (opcional)"
                />
              </Campo>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-7 justify-end">
            <button
              onClick={() => navigate('/dashboard-empresa')}
              className="px-6 py-2.5 text-sm border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={guardando}
              className="px-8 py-2.5 text-sm text-white font-bold rounded-full shadow hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              {guardando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : 'Guardar y reenviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 transition'