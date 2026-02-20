import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recuperarContrasena } from '../../services/authService'
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

const RecuperarContrasenaPage = () => {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Ingresa tu correo electrónico')
      return
    }

    setCargando(true)
    const { error } = await recuperarContrasena(email)
    setCargando(false)

    if (error) {
      toast.error('Error al enviar el correo')
      return
    }

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Correo enviado!</h1>
          <p className="text-gray-600 mb-6">
            Revisa tu bandeja de entrada en <strong>{email}</strong>. 
            Sigue las instrucciones para restablecer tu contraseña.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <FiArrowLeft />
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/Cuponera-sin fondo.png" alt="La Cuponera" className="h-14 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Recuperar contraseña</h1>
          <p className="text-gray-500 text-sm mt-1">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {cargando ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Enviar enlace'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/login" className="text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1">
            <FiArrowLeft size={14} />
            Volver al login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RecuperarContrasenaPage