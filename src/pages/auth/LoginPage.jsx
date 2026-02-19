// src/pages/auth/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { iniciarSesion } from '../../services/authService'
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cargando, setCargando] = useState(false)

  // Redirect to where user was trying to go, or home
  const destino = location.state?.from?.pathname || '/'

  const { valores, errores, handleChange, validar } = useForm(
    { email: '', password: '' },
    {
      email: { requerido: true, email: true },
      password: { requerido: true, minLength: 6 },
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setCargando(true)
    const { error } = await iniciarSesion(valores)
    setCargando(false)

    if (error) {
      // Translate common Supabase error messages
      const msg = error.message.includes('Invalid login credentials')
        ? 'Email o contraseña incorrectos'
        : error.message
      toast.error(msg)
      return
    }

    toast.success('¡Bienvenido!')
    navigate(destino, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Cuponera-sin fondo.png" alt="La Cuponera" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm mt-1">Accede a tus cupones y ofertas</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="password"
                value={valores.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.password ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {mostrarPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errores.password && <p className="text-red-500 text-xs mt-1">{errores.password}</p>}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link to="/recuperar-contrasena" className="text-sm text-orange-600 hover:text-orange-700">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {cargando ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <FiLogIn />
                Ingresar
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-orange-600 font-medium hover:text-orange-700">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage