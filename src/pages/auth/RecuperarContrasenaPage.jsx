
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { recuperarContrasena } from '../../services/authService'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const RecuperarContrasenaPage = () => {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const { valores, errores, handleChange, validar } = useForm(
    { email: '' },
    { email: { requerido: true, email: true } }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setEnviando(true)
    const { error } = await recuperarContrasena(valores.email)
    setEnviando(false)

    if (error) {
      toast.error('Error al enviar el correo')
      return
    }

    setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center relative">
          <Link to="/login" className="absolute left-4 top-4 text-white/80 hover:text-white">
            <FiArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
          <p className="text-orange-100 text-sm">Te enviaremos un enlace de recuperación</p>
        </div>

        <div className="p-6">
          {enviado ? (
            /* Success state */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">¡Correo enviado!</h2>
              <p className="text-gray-600 mb-6">
                Revisa tu bandeja de entrada en <strong>{valores.email}</strong> y sigue las instrucciones.
              </p>
              <Link 
                to="/login" 
                className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Volver al login
              </Link>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="tu@email.com"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                      errores.email ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errores.email && (
                  <p className="text-red-500 text-xs mt-1">{errores.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {enviando ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Enviando...
                  </>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                <Link to="/login" className="text-orange-600 hover:underline">
                  ← Volver al login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecuperarContrasenaPage