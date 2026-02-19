// src/pages/auth/RegistroPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { registrarCliente } from '../../services/authService'
import { FiMail, FiLock, FiUser, FiPhone, FiCreditCard, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'

const RegistroPage = () => {
  const navigate = useNavigate()
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cargando, setCargando] = useState(false)

  const { valores, errores, handleChange, validar } = useForm(
    {
      nombre: '',
      apellido: '',
      email: '',
      dui: '',
      telefono: '',
      password: '',
      confirmarPassword: '',
    },
    {
      nombre: { requerido: true, minLength: 2 },
      apellido: { requerido: true, minLength: 2 },
      email: { requerido: true, email: true },
      dui: { requerido: true, dui: true },
      password: { requerido: true, minLength: 8 },
      confirmarPassword: { requerido: true, match: 'password' },
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setCargando(true)
    const { error } = await registrarCliente({
      email: valores.email,
      password: valores.password,
      nombre: valores.nombre,
      apellido: valores.apellido,
      dui: valores.dui,
      telefono: valores.telefono,
    })
    setCargando(false)

    if (error) {
      const msg = error.message.includes('already registered')
        ? 'Este correo ya está registrado'
        : error.message
      toast.error(msg)
      return
    }

    toast.success('¡Cuenta creada! Ya puedes iniciar sesión.')
    navigate('/login')
  }

  const inputClass = (campo) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
      errores[campo] ? 'border-red-400' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/Cuponera-sin fondo.png" alt="La Cuponera" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Regístrate para comprar cupones de descuento</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={valores.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  className={inputClass('nombre')}
                />
              </div>
              {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="apellido"
                  value={valores.apellido}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className={inputClass('apellido')}
                />
              </div>
              {errores.apellido && <p className="text-red-500 text-xs mt-1">{errores.apellido}</p>}
            </div>
          </div>

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
                className={inputClass('email')}
              />
            </div>
            {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
          </div>

          {/* DUI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DUI <span className="text-gray-400 text-xs">(00000000-0)</span>
            </label>
            <div className="relative">
              <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="dui"
                value={valores.dui}
                onChange={handleChange}
                placeholder="00000000-0"
                maxLength={10}
                className={inputClass('dui')}
              />
            </div>
            {errores.dui && <p className="text-red-500 text-xs mt-1">{errores.dui}</p>}
          </div>

          {/* Teléfono (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-gray-400 text-xs">(opcional)</span>
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="telefono"
                value={valores.telefono}
                onChange={handleChange}
                placeholder="7000-0000"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="password"
                value={valores.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.password ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {mostrarPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errores.password && <p className="text-red-500 text-xs mt-1">{errores.password}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="confirmarPassword"
                value={valores.confirmarPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.confirmarPassword ? 'border-red-400' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.confirmarPassword && (
              <p className="text-red-500 text-xs mt-1">{errores.confirmarPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            {cargando ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-orange-600 font-medium hover:text-orange-700">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegistroPage