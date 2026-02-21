
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../config/supabaseClient'
import { FiUser, FiMail, FiPhone, FiCreditCard, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PerfilPage = () => {
  const { perfil, refrescarPerfil } = useAuth()
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    telefono: perfil?.telefono || '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGuardar = async () => {
    setGuardando(true)
    const { error } = await supabase
      .from('perfiles')
      .update({ telefono: form.telefono, updated_at: new Date().toISOString() })
      .eq('id', perfil.id)

    if (error) {
      toast.error('No se pudo guardar el perfil')
    } else {
      await refrescarPerfil()
      toast.success('Perfil actualizado')
      setEditando(false)
    }
    setGuardando(false)
  }

  const ROL_LABEL = {
    cliente: 'Cliente',
    admin_empresa: 'Admin de Empresa',
    administrador: 'Administrador',
  }

  const InfoRow = ({ icono, label, valor }) => (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="bg-orange-50 p-2 rounded-lg mt-0.5">{icono}</div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-gray-800 font-medium">{valor || '—'}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header card */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold">
              {perfil?.nombre?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {perfil?.nombre} {perfil?.apellido}
              </h1>
              <p className="opacity-90 text-sm">{perfil?.email}</p>
              <span className="inline-block mt-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {ROL_LABEL[perfil?.rol] || perfil?.rol}
              </span>
            </div>
          </div>
        </div>

        {/* Profile details */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Datos personales</h2>
            {!editando ? (
              <button
                onClick={() => setEditando(true)}
                className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                <FiEdit2 size={14} />
                Editar
              </button>
            ) : (
              <button
                onClick={() => setEditando(false)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm"
              >
                <FiX size={14} />
                Cancelar
              </button>
            )}
          </div>

          <InfoRow
            icono={<FiUser className="text-orange-500" />}
            label="Nombre completo"
            valor={`${perfil?.nombre} ${perfil?.apellido}`}
          />
          <InfoRow
            icono={<FiMail className="text-orange-500" />}
            label="Correo electrónico"
            valor={perfil?.email}
          />
          <InfoRow
            icono={<FiCreditCard className="text-orange-500" />}
            label="DUI"
            valor={perfil?.dui}
          />

          {/* Editable: phone */}
          <div className="flex items-start gap-3 py-4 border-b border-gray-100">
            <div className="bg-orange-50 p-2 rounded-lg mt-0.5">
              <FiPhone className="text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Teléfono</p>
              {editando ? (
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="7000-0000"
                  className="border border-orange-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-full max-w-xs"
                />
              ) : (
                <p className="text-gray-800 font-medium">{perfil?.telefono || '—'}</p>
              )}
            </div>
          </div>

          {/* Save button */}
          {editando && (
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="mt-5 w-full bg-orange-500 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {guardando ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <FiSave size={15} />
                  Guardar cambios
                </>
              )}
            </button>
          )}
        </div>

        {/* Member since */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Miembro desde{' '}
          {perfil?.created_at
            ? new Date(perfil.created_at).toLocaleDateString('es-ES', {
                month: 'long',
                year: 'numeric',
              })
            : '—'}
        </p>
      </div>
    </div>
  )
}

export default PerfilPage