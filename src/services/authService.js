// src/services/authService.js
import { supabase } from '../config/supabaseClient'

/**
 * Register a new client
 * Creates auth user + profile via trigger
 */
export const registrarCliente = async ({ email, password, nombre, apellido, dui, telefono }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, apellido, rol: 'cliente' },
      },
    })

    if (error) throw error

    // If email confirmation is disabled, update DUI/phone immediately
    if (data.user && dui) {
      await supabase
        .from('perfiles')
        .update({ dui, telefono })
        .eq('id', data.user.id)
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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
  const { error } = await supabase.auth.signOut()
  return { error }
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
    return { error }
  }
}