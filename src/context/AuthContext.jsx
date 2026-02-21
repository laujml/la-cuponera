
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabaseClient'
import { obtenerPerfil } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)  
  const [perfil, setPerfil] = useState(null)     
  const [cargando, setCargando] = useState(true) 

 const cargarPerfil = async (user) => {
  if (!user) {
    setPerfil(null)
    return
  }
  
  // Perfil básico sin llamar a la base de datos
  setPerfil({
    id: user.id,
    email: user.email,
    nombre: user.user_metadata?.nombre || 'Usuario',
    apellido: user.user_metadata?.apellido || '',
    rol: 'cliente',
  })
} 

  useEffect(() => {
    // 1. Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null
      setUsuario(user)
      cargarPerfil(user).finally(() => setCargando(false))
    })

    // 2. Subscribe to auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null
        setUsuario(user)
        await cargarPerfil(user)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Role helpers — clean and readable
  const esCliente = perfil?.rol === 'cliente'
  const esAdminEmpresa = perfil?.rol === 'admin_empresa'
  const esAdministrador = perfil?.rol === 'administrador'
  const esEmpleado = perfil?.rol === 'empleado'
  const estaAutenticado = !!usuario

  const value = {
    usuario,
    perfil,
    cargando,
    estaAutenticado,
    esCliente,
    esAdminEmpresa,
    esAdministrador,
    esEmpleado,
    refrescarPerfil: () => cargarPerfil(usuario),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Clean hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}