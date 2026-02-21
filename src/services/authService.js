
import { supabase } from '../config/supabaseClient'


export const registrarCliente = async ({ email, password, nombre, apellido, dui, telefono }) => {
  try {
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          nombre, 
          apellido, 
          rol: 'cliente' 
        },
      },
    })

    if (error) throw error

    // 2. If user was created and email confirmation is disabled, 
    //    update DUI/phone immediately
    if (data.user && dui) {
      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { error: updateError } = await supabase
        .from('perfiles')
        .update({ 
          dui, 
          telefono,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.user.id)

      if (updateError) {
        console.warn('No se pudo actualizar DUI/teléfono:', updateError)
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error en registro:', error)
    return { data: null, error }
  }
}

/**
 * Log in with email and password
 */
export const iniciarSesion = async ({ email, password }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error en login:', error)
    return { data: null, error }
  }
}

/**
 * Log out current user
 */
export const cerrarSesion = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error en logout:', error)
    return { error }
  }
}

/**
 * Get the profile (with role) for a given user id
 */
export const obtenerPerfil = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    return { data: null, error }
  }
}

/**
 * Update user profile
 */
export const actualizarPerfil = async (userId, datos) => {
  try {
    const { data, error } = await supabase
      .from('perfiles')
      .update({
        ...datos,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    return { data: null, error }
  }
}

/**
 * Send password reset email
 */
export const recuperarContrasena = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error en recuperación:', error)
    return { error }
  }
}

/**
 * Get current session
 */
export const obtenerSesion = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    return { session: null, error }
  }
}

/**
 * Get current user
 */
export const obtenerUsuarioActual = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}