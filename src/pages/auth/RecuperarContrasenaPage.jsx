// src/pages/auth/RecuperarContrasenaPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recuperarContrasena } from '../../services/authService'
import { useForm } from '../../hooks/useForm'
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const RecuperarContrasenaPage = () => {
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  const { valores, errores, handleChange, validar } = useForm(
    { email: '' },
    { email: { requerido: true, email: true } }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setCargando(true)
    const { error } = await recuperarContrasena(valores.email)
    setCargando(false)

    if (error) {
      toast.error('No se pudo enviar el correo. Intenta de nuevo.')
      return
    }

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Correo enviado!</h2>
          <p className="text-gray-600 mb-6">
            Revisa tu bandeja de entrada en <strong>{valores.email}</strong> para recuperar tu contraseña.
          </p>
          <Link to="/login" className="text-orange-600 font-medium hover:text-orange-700">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="/Cuponera-sin fondo.png" alt="La Cuponera" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Recuperar contraseña</h1>
          <p className="text-gray-500 text-sm mt-1">Te enviaremos un enlace para restablecer tu contraseña</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={valores.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.email ? 'border-red-400' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-60"
          >
            {cargando ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-6">
          <FiArrowLeft size={14} />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}

export default RecuperarContrasenaPage