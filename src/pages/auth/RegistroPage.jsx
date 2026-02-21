// src/pages/auth/RegistroPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { registrarCliente } from '../../services/authService'
import { FiUser, FiMail, FiLock, FiPhone, FiCreditCard, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'

const RegistroPage = () => {
  const navigate = useNavigate()
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const { valores, errores, handleChange, validar } = useForm(
    { nombre: '', apellido: '', email: '', dui: '', telefono: '', password: '', confirmarPassword: '' },
    {
      nombre: { requerido: true, minLength: 2 },
      apellido: { requerido: true, minLength: 2 },
      email: { requerido: true, email: true },
      dui: { requerido: true, dui: true },
      telefono: { requerido: false },
      password: { requerido: true, minLength: 6 },
      confirmarPassword: { requerido: true, match: 'password' },
    }
  )

  // Auto-format DUI: 00000000-0
  const handleDuiChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 9)
    if (raw.length > 8) {
      raw = raw.slice(0, 8) + '-' + raw.slice(8)
    }
    handleChange({ target: { name: 'dui', value: raw } })
  }

  // Auto-format phone: 0000-0000
  const handleTelefonoChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 8)
    if (raw.length > 4) {
      raw = raw.slice(0, 4) + '-' + raw.slice(4)
    }
    handleChange({ target: { name: 'telefono', value: raw } })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validar()) return

    setEnviando(true)
    const { error } = await registrarCliente(valores)
    setEnviando(false)

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('Este correo ya está registrado')
      } else {
        toast.error(error.message || 'Error al registrar')
      }
      return
    }

    toast.success('¡Cuenta creada exitosamente!')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center relative">
          <Link to="/" className="absolute left-4 top-4 text-white/80 hover:text-white">
            <FiArrowLeft className="text-xl" />
          </Link>
          <img 
            src="/Cuponera-sin fondo.png" 
            alt="La Cuponera" 
            className="h-14 mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-orange-100 text-sm">Únete y empieza a ahorrar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
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
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    errores.nombre ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
              </div>
              {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={valores.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.apellido ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errores.apellido && <p className="text-red-500 text-xs mt-1">{errores.apellido}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
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
            {errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}
          </div>

          {/* DUI y Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DUI</label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="dui"
                  value={valores.dui}
                  onChange={handleDuiChange}
                  placeholder="00000000-0"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    errores.dui ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
              </div>
              {errores.dui && <p className="text-red-500 text-xs mt-1">{errores.dui}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="telefono"
                  value={valores.telefono}
                  onChange={handleTelefonoChange}
                  placeholder="7777-8888"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 border-gray-300`}
                />
              </div>
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
                placeholder="Mínimo 6 caracteres"
                className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
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

          {/* Confirmar password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={mostrarPassword ? 'text' : 'password'}
                name="confirmarPassword"
                value={valores.confirmarPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errores.confirmarPassword ? 'border-red-400' : 'border-gray-300'
                }`}
              />
            </div>
            {errores.confirmarPassword && <p className="text-red-500 text-xs mt-1">{errores.confirmarPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {enviando ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-orange-600 font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegistroPage