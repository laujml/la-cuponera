// src/services/ofertasService.js
import { supabase } from '../config/supabaseClient'

// Obtener todas las ofertas activas
export const getOfertasActivas = async () => {
  try {
    const { data, error } = await supabase
      .from('ofertas_activas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al obtener ofertas:', error)
    return { data: null, error }
  }
}

// Obtener ofertas filtradas por rubro
export const getOfertasPorRubro = async (rubroId) => {
  try {
    const { data, error } = await supabase
      .from('ofertas_activas')
      .select('*')
      .eq('rubro_id', rubroId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al filtrar ofertas:', error)
    return { data: null, error }
  }
}

// Obtener una oferta específica por ID
export const getOfertaPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('ofertas_activas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al obtener oferta:', error)
    return { data: null, error }
  }
}

// Obtener todos los rubros
export const getRubros = async () => {
  try {
    const { data, error } = await supabase
      .from('rubros')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al obtener rubros:', error)
    return { data: null, error }
  }
}

// Buscar ofertas por texto
export const buscarOfertas = async (searchText) => {
  try {
    const { data, error } = await supabase
      .from('ofertas_activas')
      .select('*')
      .or(`titulo.ilike.%${searchText}%,descripcion.ilike.%${searchText}%,empresa_nombre.ilike.%${searchText}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al buscar ofertas:', error)
    return { data: null, error }
  }
}